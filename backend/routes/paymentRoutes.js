const express = require("express");
const { auth } = require("../middleware/authMiddleware");
const { createRazorpayOrder, verifyPayment, getPaymentDetails, getPaymentHistory } = require("../controllers/paymentController");
const router = express.Router();

router.post("/create-order", auth, createRazorpayOrder);
router.post("/verify", auth, verifyPayment);
router.get("/load/:loadId", auth, getPaymentDetails);
router.get("/history", auth, getPaymentHistory);

module.exports = router;