const express = require("express");
const {getBiddingHistory,placeBid, getWinningBids, updateTrackingStatus, getMyBids, updateBid, deleteBid, deleteBidByAdmin} = require("../controllers/biddingController");
const { auth, isSender, isDriver, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/won", auth, getWinningBids);
router.get("/my-bids", auth, isDriver, getMyBids);
router.get("/:loadId", getBiddingHistory);
router.post("/", auth, isDriver, placeBid);

router.patch("/track", auth, isDriver, updateTrackingStatus);
router.patch("/:id", auth, isDriver, updateBid);
router.delete("/admin/:id", auth, isAdmin, deleteBidByAdmin);
router.delete("/:id", auth, isDriver, deleteBid);

module.exports = router;