const { WebSocketServer } = require("ws");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const clients = new Map();
const loadSubscriptions = new Map();

function setupWebSocket(server) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws) => {
    let userId = null;
    let subscribedLoadId = null;

    ws.on("message", async (raw) => {
      try {
        const msg = JSON.parse(raw.toString());

        switch (msg.type) {
          case "auth": {
            const token = msg.token;
            if (!token) {
              ws.send(JSON.stringify({ type: "error", message: "No token" }));
              return;
            }
            try {
              const verified = jwt.verify(token, process.env.JWT_SECRET);
              const user = await User.findById(verified.id).select("-password");
              if (!user) {
                ws.send(JSON.stringify({ type: "error", message: "User not found" }));
                return;
              }
              userId = user._id.toString();

              if (!clients.has(userId)) clients.set(userId, new Set());
              clients.get(userId).add(ws);

              ws.send(JSON.stringify({ type: "auth_ok", userId }));

              if (subscribedLoadId) {
                subscribeUser(userId, subscribedLoadId);
              }

            } catch {
              ws.send(JSON.stringify({ type: "error", message: "Invalid token" }));
            }
            break;
          }

          case "subscribe": {
            subscribedLoadId = msg.loadId;
            if (userId && subscribedLoadId) {
              subscribeUser(userId, subscribedLoadId);
            }
            break;
          }

          case "unsubscribe": {
            if (userId && subscribedLoadId) {
              unsubscribeUser(userId, subscribedLoadId);
            }
            subscribedLoadId = null;
            break;
          }

          case "ping": {
            ws.send(JSON.stringify({ type: "pong" }));
            break;
          }
        }
      } catch {
        ws.send(JSON.stringify({ type: "error", message: "Invalid message" }));
      }
    });

    const closeHandler = () => {
      if (userId) {
        removeClient(userId, ws, subscribedLoadId);
      }
    };
    ws.on("close", closeHandler);

    ws.send(JSON.stringify({ type: "connected" }));
  });

  return wss;
}

function subscribeUser(userId, loadId) {
  if (!loadSubscriptions.has(loadId)) loadSubscriptions.set(loadId, new Set());
  loadSubscriptions.get(loadId).add(userId);
}

function unsubscribeUser(userId, loadId) {
  if (loadSubscriptions.has(loadId)) {
    loadSubscriptions.get(loadId).delete(userId);
    if (loadSubscriptions.get(loadId).size === 0) loadSubscriptions.delete(loadId);
  }
}

function removeClient(userId, ws, loadId) {
  if (clients.has(userId)) {
    clients.get(userId).delete(ws);
    if (clients.get(userId).size === 0) {
      clients.delete(userId);
      if (loadId) {
        unsubscribeUser(userId, loadId);
      }
    }
  }
}

function sendToUser(userId, event, data) {
  if (!clients.has(userId)) return;
  const msg = JSON.stringify({ type: "event", event, data });
  for (const ws of clients.get(userId)) {
    if (ws.readyState === 1) {
      try { ws.send(msg); } catch {}
    }
  }
}

function sendToLoadWatchers(loadId, event, data) {
  if (!loadSubscriptions.has(loadId)) return;
  const msg = JSON.stringify({ type: "event", event, data });
  for (const userId of loadSubscriptions.get(loadId)) {
    if (clients.has(userId)) {
      for (const ws of clients.get(userId)) {
        if (ws.readyState === 1) {
          try { ws.send(msg); } catch {}
        }
      }
    }
  }
}

function broadcast(event, data) {
  const msg = JSON.stringify({ type: "event", event, data });
  for (const [, connections] of clients) {
    for (const ws of connections) {
      if (ws.readyState === 1) {
        try { ws.send(msg); } catch {}
      }
    }
  }
}

module.exports = { setupWebSocket, sendToUser, sendToLoadWatchers, broadcast };
