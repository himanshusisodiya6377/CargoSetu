const express = require("express");
const {getBiddingHistory,placeBid,finalizeLoad} = require("../controllers/biddingController");
const { auth, isSender } = require("../middleWare/authMiddleware");
const router = express.Router();

router.get("/:loadId", getBiddingHistory);
router.post("/", auth, placeBid);
router.post("/sell", auth, isSender, finalizeLoad);

module.exports = router;