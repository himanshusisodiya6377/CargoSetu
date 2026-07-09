import { useEffect, useRef } from "react";
import { BACKEND_URL } from "../utils/url";

export function useSSE(loadId, handlers) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;
  const reconnectRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (abortRef.current) abortRef.current.abort();
    const abortController = new AbortController();
    abortRef.current = abortController;

    const params = loadId ? `?loadId=${loadId}` : "";
    const url = `${BACKEND_URL}/events${params}`;

    const start = async () => {
      try {
        const response = await fetch(url, {
          credentials: "include",
          signal: abortController.signal,
          headers: { Accept: "text/event-stream" },
        });

        if (!response.ok) {
          if (response.status === 401) return;
          throw new Error(`SSE connection failed: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let currentEvent = "";
        let currentData = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n");
          buffer = parts.pop() || "";

          for (const line of parts) {
            if (line.startsWith("event: ")) {
              currentEvent = line.slice(7).trim();
            } else if (line.startsWith("data: ")) {
              currentData = line.slice(6);
            } else if (line === "" && currentEvent) {
              if (currentEvent !== "connected") {
                try {
                  const parsed = JSON.parse(currentData);
                  const h = handlersRef.current[currentEvent];
                  if (h) h(parsed);
                } catch { /* ignore malformed SSE data */ }
              }
              currentEvent = "";
              currentData = "";
            }
          }
        }
      } catch (err) {
        if (err.name === "AbortError") return;
      }

      if (!abortController.signal.aborted) {
        reconnectRef.current = setTimeout(start, 3000);
      }
    };

    start();

    return () => {
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      abortController.abort();
    };
  }, [loadId]);
}
