const express = require("express");
const { auth } = require("../middleware/authMiddleware");
const sseService = require("../services/sseService");
const router = express.Router();

router.get("/", auth, (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const userId = req.user._id.toString();
  const loadId = req.query.loadId || null;

  sseService.addClient(userId, res, loadId);

  res.write(`event: connected\ndata: {"userId":"${userId}"}\n\n`);

  const keepAlive = setInterval(() => {
    res.write(":keepalive\n\n");
  }, 30000);

  req.on("close", () => {
    clearInterval(keepAlive);
    sseService.removeClient(userId, res, loadId);
  });
});

module.exports = router;
