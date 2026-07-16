const Load = require("../models/Load");
const BiddingLoad = require("../models/biddingLoad");
const User = require("../models/User");
const { calculateAndSave } = require("../utils/commission");
const {sendBidPlacedEmail, sendBidWonEmail,sendLoadAssignedEmail,sendDeliveryConfirmationEmail} = require("../services/biddingEmailService");
const { sendToLoadWatchers, sendToUser } = require("../services/websocketService");

const getBiddingHistory = async(req, res) =>{
  try {
    const { loadId } = req.params;

    if (!loadId) {
      return res.status(400).json({
        message: "Load ID is required",
      });
    }

    const bids = await BiddingLoad.find({ load: loadId }).sort({ createdAt: 1 }).populate("driver", "name email photo").populate("load");

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

const placeBid =async(req,res) =>{
  try {
    const {loadId,amount} = req.body;
    const driverId = req.user._id;

    if(!loadId || !amount){
      return res.status(400).json({
        success: false,
        message: "Load ID and bid amount are required",
      })}

    const load = await Load.findById(loadId);

    if(!load){
      return res.status(404).json({
        success: false,
        message: "Load not found",
      })}

    if(load.status !== "BIDDING"){
      return res.status(400).json({
        success: false,
        message: "Bidding is closed for this load",
      })}

    const now = new Date();

    // bidding time window
    if (now < load.bidStartTime || now > load.bidEndTime) {
      return res.status(400).json({
        success: false,
        message: "Bidding time window is closed",
      })}

    // driver must not already have an active load
    const activeLoad = await Load.findOne({ assignedDriver: driverId, status: { $nin: ["DELIVERED", "ENDED"] }});
    if(activeLoad){
      return res.status(400).json({
        success: false,
        message: "You already have an active load in progress. Complete it before bidding on new ones.",
      })}

    // check current lowest bid
    const lowestBid = await BiddingLoad.findOne({load: loadId}).sort({amount: 1});

    if(lowestBid && amount > lowestBid.amount){
      return res.status(400).json({
        success: false,
        message: `Your bid must be ₹${lowestBid.amount} or lower`,
      })}

    // create new bid
    const bid = await BiddingLoad.create({
      load: loadId,
      driver: driverId,
      amount,
    });

    // Send confirmation email to driver
    try {
      const driver = await User.findById(driverId);
      if (driver) {
        await sendBidPlacedEmail({
          driver,
          load,
          bidAmount: amount
        });
      }
    } catch (emailErr) {
      console.error("Failed to send bid placed email:", emailErr.message);
    }

    sendToLoadWatchers(loadId, "newBid", {
      loadId, bid: { _id: bid._id, driver: { _id: driverId, name: req.user.name }, amount, createdAt: bid.createdAt },
    });

    return res.status(201).json({
      success: true,
      message: "Bid placed successfully",
      bid,
    });

  } catch (error){
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getWinningBids = async (req, res)=>{
  try {
    const user = req.user;
    let winningBids;

    if (user.role === "Driver") {
      winningBids = await BiddingLoad.find({driver: user._id, status: "WON"}).populate({
          path: "load",
          populate: {path: "sender", select: "name email phone photo createdAt"},
        }).populate("driver", "name email phone photo vehicleType licenseNumber createdAt").sort({ updatedAt: -1 });
      
        winningBids = winningBids.filter((b) => b.load?.status !== "DELIVERED");

    }else if(user.role === "Sender"){
      const assignedLoads = await Load.find({sender: user._id, status: { $in:["PAYMENT_PENDING", "ASSIGNED", "IN_TRANSIT"]}});
      const loadIds = assignedLoads.map((l) => l._id);

      winningBids = await BiddingLoad.find({load: { $in: loadIds }, status: "WON"}).populate("load").populate("driver", "name email phone photo vehicleType licenseNumber createdAt").sort({updatedAt: -1});
    } else {
      return res.status(403).json({message: "Access denied"});
    }

    return res.status(200).json({ success: true, data: winningBids });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch winning bids", error: error.message });
  }
};

const updateTrackingStatus = async (req, res)=>{
  try {
    const {loadId, status} = req.body;
    const driverId = req.user._id;

    const validTransitions = {ASSIGNED: "IN_TRANSIT", IN_TRANSIT: "DELIVERED"};

    if (!["IN_TRANSIT", "DELIVERED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const load = await Load.findOne({_id: loadId, assignedDriver: driverId}).populate("sender", "name email");

    if(!load){
      return res.status(404).json({ message: "Load not found or not your assigned load"});
    }

    if(load.status === "DELIVERED"){
      return res.status(400).json({ message: "Load already delivered"});
    }

    if(validTransitions[load.status] !== status) {
      return res.status(400).json({
        message: `Cannot move from ${load.status} to ${status}`,
      });
    }

    load.status = status;
    if(status === "DELIVERED"){
      load.deliveryDate = new Date();
    }
    await load.save();

    if(status === "DELIVERED"){
      const winningBid = await BiddingLoad.findOne({load: load._id, status: "WON"});
      if (winningBid) {
        winningBid.isCompleted = true;
        await winningBid.save();

        if (winningBid.commissionAmount > 0) {
          await User.updateOne({ role: "Admin" }, { $inc: { commissionBalance: winningBid.commissionAmount } });
        }

      }
      try{
        await sendDeliveryConfirmationEmail({sender: load.sender, load});
      } catch (err) {
        console.error("Delivery email failed:", err.message);
      }
    }

    sendToUser(load.sender._id.toString(), "trackingUpdate", {
      loadId: load._id, status: load.status, deliveryDate: load.deliveryDate,
    });

    return res.status(200).json({ success: true, message: `Status updated to ${status}`, data: load });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update tracking", error: error.message });
  }
};

const getMyBids = async (req, res)=>{
  try {
    const bids = await BiddingLoad.find({driver: req.user._id}).populate({
      path: "load",
      select: "title pickupLocation dropLocation status bidEndTime",
      populate: { path: "sender", select: "name photo" },
    }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: bids });
  } catch (error){
    return res.status(500).json({ message: "Failed to fetch your bids", error: error.message });
  }
};

// UPDATE A BID (only if load is still OPEN and bid belongs to this driver)
const updateBid = async (req, res)=>{
  try {
    const {amount} = req.body;
    const bid = await BiddingLoad.findById(req.params.id);
    if (!bid) return res.status(404).json({message: "Bid not found"});
    if (bid.driver.toString() !== req.user._id.toString())
      return res.status(403).json({message: "Not your bid"});

    const load = await Load.findById(bid.load);
    if (!load || load.status !== "OPEN")
      return res.status(400).json({ message: "Bidding is closed for this load"});
    if (new Date() > new Date(load.bidEndTime))
      return res.status(400).json({ message: "Bid window has ended"});

    const lowest = await BiddingLoad.findOne({load: bid.load, _id: {$ne: bid._id}}).sort({amount: 1});
    if (lowest && amount >= lowest.amount)
      return res.status(400).json({message: `Your bid must be lower than ₹${lowest.amount}`});

    bid.amount = amount;
    await bid.save();

    return res.status(200).json({ success: true, message: "Bid updated", data: bid });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE A BID (only if load is still OPEN)
const deleteBid = async (req, res)=>{
  try {
    const bid = await BiddingLoad.findById(req.params.id);
    if(!bid) return res.status(404).json({message: "Bid not found"});
    if(bid.driver.toString() !== req.user._id.toString())
      return res.status(403).json({message: "Not your bid"});

    const load = await Load.findById(bid.load);
    if(!load || load.status !== "OPEN")
      return res.status(400).json({ message: "Cannot withdraw bid after load is assigned" });
    if(new Date() > new Date(load.bidEndTime))
      return res.status(400).json({ message: "Bid window has ended" });

    await bid.deleteOne();

    return res.status(200).json({ success: true, message: "Bid withdrawn" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ADMIN: DELETE ANY BID
const deleteBidByAdmin = async (req, res)=>{
  try {
    const bid = await BiddingLoad.findById(req.params.id);
    if (!bid) return res.status(404).json({message: "Bid not found"});

    // const loadId = bid.load;
    await bid.deleteOne();

    return res.status(200).json({ success: true, message: "Bid deleted by admin" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {placeBid, getBiddingHistory, getWinningBids, updateTrackingStatus, getMyBids, updateBid, deleteBid, deleteBidByAdmin};
