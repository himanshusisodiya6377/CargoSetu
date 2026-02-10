const Load = require("../models/Load");
const BiddingLoad = require("../models/biddingLoad");
const User = require("../models/User");
const {sendBidWonEmail,sendLoadAssignedEmail} = require("../services/biddingEmailService");

const getBiddingHistory = async (req, res) => {
  try {
    const { loadId } = req.params;
    // console.log(loadId)

    if (!loadId) {
      return res.status(400).json({
        message: "Load ID is required",
      });
    }

    const bids = await BiddingLoad.find({ load: loadId }).sort({ createdAt: 1 }).populate("driver").populate("load");

    return res.status(200).json({
      success: true,
      count: bids.length,
      data: bids,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch bidding history",
      error: error.message,
    });
  }
};

const placeBid = async (req, res) => {
  try {
    const { loadId, amount } = req.body;
    const driverId = req.user._id;

    // console.log(loadId, amount);

    if (!loadId || !amount) {
      return res.status(400).json({
        message: "Load ID and bid amount are required",
      });
    }

    const load = await Load.findById(loadId);

    if (!load) {
      return res.status(404).json({
        message: "Load not found",
      });
    }

    if (!load.isVerified) {
      return res.status(400).json({
        message: "Load is not verified for bidding",
      });
    }

    if (load.status !== "OPEN") {
      return res.status(400).json({
        message: "Bidding is closed for this load",
      });
    }

    const now = new Date();
    if (now < load.bidStartTime || now > load.bidEndTime) {
      return res.status(400).json({
        message: "Bidding time window is closed",
      });
    }

    const lowestBid = await BiddingLoad.findOne({ load: loadId }).sort({ amount: 1 }).lean();

    if (lowestBid && amount >= lowestBid.amount) {
      return res.status(400).json({
        message: "Your bid must be lower than current lowest bid",
      });
    }

    const bid = await BiddingLoad.create({
      load: loadId,
      driver: driverId,
      amount,
    });

    return res.status(201).json({
      success: true,
      message: "Bid placed successfully",
      data: bid,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const finalizeLoad = async (req, res) => {
  try {
    const { loadId } = req.body;
    const senderId = req.user._id;

    if (!loadId) {
      return res.status(400).json({
        message: "Load ID is required",
      });
    }

    const load = await Load.findById(loadId).populate("sender");
    if (!load) {
      return res.status(404).json({
        message: "Load not found",
      });
    }

    if (load.sender._id.toString() !== senderId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to finalize this load",
      });
    }

    if (load.status !== "OPEN") {
      return res.status(400).json({
        message: "Load is already closed",
      });
    }

    const winningBid = await BiddingLoad.findOne({ load: loadId }).sort({ amount: 1 }).populate("driver");

    if (!winningBid) {
      return res.status(400).json({
        message: "No bids found for this load",
      });
    }

    const commissionPercent = load.adminCommission || 0;
    const commissionAmount =(commissionPercent / 100) * winningBid.amount;

    const finalAmount = winningBid.amount - commissionAmount;

    load.status = "ASSIGNED";
    load.winningDriver = winningBid.driver._id;
    load.finalAmount = finalAmount;
    await load.save();

    await BiddingLoad.updateMany(
      { load: loadId },
      { status: "LOST" }
    );

    winningBid.status = "WON";
    await winningBid.save();

    const admin = await User.findOne({ role: "Admin" });
    if (admin) {
      admin.commissionBalance += commissionAmount;
      await admin.save();
    }

    const driver = await User.findById(winningBid.driver._id);
    if (driver) {
      driver.balance += finalAmount;
      driver.jobsCompleted += 1;
      await driver.save();
    }

    // console.log("Finalizing load, sending emails");
    // console.log("Driver email:", winningBid.driver.email);
    // console.log("Sender email:", load.sender.email);


     await sendBidWonEmail({
      driver: winningBid.driver,
      load,
      finalAmount,
     });

     await sendLoadAssignedEmail({
      sender: load.sender,
      driver: winningBid.driver,
      load,
      finalAmount,
      });

    return res.status(200).json({
      success: true,
      message: "Load finalized successfully",
      data: {
        loadId: load._id,
        winningDriver: winningBid.driver.name,
        bidAmount: winningBid.amount,
        commissionAmount,
        finalAmount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {placeBid,getBiddingHistory,finalizeLoad};