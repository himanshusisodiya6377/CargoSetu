const crypto = require("crypto");
const Payment = require("../models/Payment");
const Load = require("../models/Load");
const BiddingLoad = require("../models/biddingLoad");
const razorpayInstance = require("../config/razorpay");
const CommissionConfig = require("../models/CommissionConfig");
const { calculateCommission } = require("../utils/commission");
const { sendBidWonEmail, sendLoadAssignedEmail } = require("../services/biddingEmailService");

const createRazorpayOrder = async (req, res) => {
  try {
    const { loadId } = req.body;
    const senderId = req.user._id;

    const load = await Load.findOne({ _id: loadId, sender: senderId });
    if (!load) return res.status(404).json({ message: "Load not found" });

    if (load.status !== "PAYMENT_PENDING") {
      return res.status(400).json({ message: "Payment is not pending for this load" });
    }

    const existingPayment = await Payment.findOne({ load: loadId, paymentStatus: "PENDING" });
    if (existingPayment) {
      return res.status(200).json({
        success: true,
        orderId: existingPayment.razorpayOrderId,
        amount: existingPayment.amount,
        paymentId: existingPayment._id,
      });
    }

    const winningBid = await BiddingLoad.findOne({ load: loadId, status: "WON" }).populate("driver", "name email");
    if (!winningBid) return res.status(400).json({ message: "No winning bid found" });

    const commissionPercentage = winningBid.commissionPercentage || (await CommissionConfig.getConfig()).percentage;
    const { commissionAmount, driverAmount } = calculateCommission(winningBid.amount, commissionPercentage);

    const amountInPaise = Math.round(winningBid.amount * 100);

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `ld_${loadId.toString().slice(-8)}_${Date.now()}`,
      notes: {
        loadId: loadId.toString(),
        senderId: senderId.toString(),
        driverId: winningBid.driver._id.toString(),
      },
    });

    const payment = await Payment.create({
      load: loadId,
      sender: senderId,
      driver: winningBid.driver._id,
      amount: winningBid.amount,
      commissionPercentage,
      commissionAmount,
      driverAmount,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "PENDING",
    });

    return res.status(201).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({ message: "Failed to create payment order", error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      await Payment.findOneAndUpdate(
        { razorpayOrderId },
        { paymentStatus: "FAILED" }
      );
      return res.status(400).json({ success: false, message: "Payment verification failed — invalid signature" });
    }

    const payment = await Payment.findOne({ razorpayOrderId }).populate("load driver");
    if (!payment) return res.status(404).json({ message: "Payment record not found" });

    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.paymentStatus = "SUCCESSFUL";
    payment.paidAt = new Date();
    payment.transactionId = razorpayPaymentId;

    if (!payment.commissionPercentage) {
      const winningBidDoc = await BiddingLoad.findOne({ load: payment.load._id, status: "WON" });
      if (winningBidDoc) {
        payment.commissionPercentage = winningBidDoc.commissionPercentage;
        payment.commissionAmount = winningBidDoc.commissionAmount;
        payment.driverAmount = winningBidDoc.driverAmount;
      }
    }

    await payment.save();

    const load = await Load.findById(payment.load._id).populate("sender", "name email");
    if (!load) return res.status(404).json({ message: "Load not found" });

    load.status = "ASSIGNED";
    load.assignedDriver = payment.driver._id;
    await load.save();

    const winningBidDoc = await BiddingLoad.findOne({ load: load._id, status: "WON" });
    if (!winningBidDoc) {
      await BiddingLoad.updateMany(
        { load: load._id },
        { status: "LOST" }
      );
    }

    try {
      await sendBidWonEmail({ driver: payment.driver, load, finalAmount: payment.amount });
      await sendLoadAssignedEmail({ sender: load.sender, driver: payment.driver, load, finalAmount: payment.amount });
    } catch (emailErr) {
      console.error("Payment confirmation email failed:", emailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified and load assigned successfully",
      payment,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return res.status(500).json({ message: "Payment verification failed", error: error.message });
  }
};

const getPaymentDetails = async (req, res) => {
  try {
    const { loadId } = req.params;
    const userId = req.user._id;

    const payment = await Payment.findOne({ load: loadId }).populate("sender driver", "name email");

    if (!payment) return res.status(404).json({ message: "No payment found for this load" });

    if (payment.sender._id.toString() !== userId.toString() && payment.driver._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to view this payment" });
    }

    return res.status(200).json({ success: true, data: payment });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch payment details", error: error.message });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const payments = await Payment.find({
      $or: [{ sender: userId }, { driver: userId }],
    }).populate("load", "title pickupLocation dropLocation").sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch payment history", error: error.message });
  }
};

module.exports = { createRazorpayOrder, verifyPayment, getPaymentDetails, getPaymentHistory };