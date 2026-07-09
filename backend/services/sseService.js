const clients = new Map();
const loadSubscriptions = new Map();

function addClient(userId, res, loadId) {
  if (!clients.has(userId)) clients.set(userId, new Set());
  clients.get(userId).add(res);

  if (loadId) {
    if (!loadSubscriptions.has(loadId)) loadSubscriptions.set(loadId, new Set());
    loadSubscriptions.get(loadId).add(userId);
  }

  res.on("close", () => removeClient(userId, res, loadId));
}

function removeClient(userId, res, loadId) {
  if (clients.has(userId)) {
    clients.get(userId).delete(res);
    if (clients.get(userId).size === 0) clients.delete(userId);
  }
  if (loadId && loadSubscriptions.has(loadId)) {
    loadSubscriptions.get(loadId).delete(userId);
    if (loadSubscriptions.get(loadId).size === 0) loadSubscriptions.delete(loadId);
  }
}

function sendToUser(userId, event, data) {
  if (!clients.has(userId)) return;
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of clients.get(userId)) {
    res.write(msg);
  }
}

function sendToLoadWatchers(loadId, event, data) {
  if (!loadSubscriptions.has(loadId)) return;
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const userId of loadSubscriptions.get(loadId)) {
    if (clients.has(userId)) {
      for (const res of clients.get(userId)) {
        res.write(msg);
      }
    }
  }
}

function broadcast(event, data) {
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const [, responses] of clients) {
    for (const res of responses) {
      res.write(msg);
    }
  }
}

module.exports = { addClient, removeClient, sendToUser, sendToLoadWatchers, broadcast };
