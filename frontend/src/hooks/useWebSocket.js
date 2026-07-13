import { useEffect, useRef } from "react";
import { BACKEND_URL } from "../utils/url";

export function useWebSocket(loadId, handlers) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;
  const wsRef = useRef(null);
  const reconnectRef = useRef(null);
  const intentionalCloseRef = useRef(false);

  useEffect(() => {
    intentionalCloseRef.current = false;

    const baseUrl = BACKEND_URL.replace(/^http/, "ws").replace(/\/api\/?$/, "");
    const url = `${baseUrl}/ws`;

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }

    const connect = () => {
      const ws = new WebSocket(url);
      wsRef.current = ws;
      ws.onerror = () => {};

      ws.onopen = () => {
        const token = localStorage.getItem("token");
        if (token) {
          ws.send(JSON.stringify({ type: "auth", token }));
        }
        if (loadId) {
          ws.send(JSON.stringify({ type: "subscribe", loadId }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === "event") {
            const h = handlersRef.current[msg.event];
            if (h) h(msg.data);
          }
        } catch {
          /* ignore malformed messages */
        }
      };

      ws.onclose = () => {
        if (!intentionalCloseRef.current) {
          reconnectRef.current = setTimeout(connect, 3000);
        }
      };
    };

    connect();

    return () => {
      intentionalCloseRef.current = true;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [loadId]);
}
