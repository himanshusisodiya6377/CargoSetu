const Load = require("../models/Load");
const cloudinary = require("../config/cloudinary.js");
const fs = require("fs");
const biddingLoad=require("../models/biddingLoad.js")

const createLoad = async(req, res) =>{
  try {

    // console.log(req.body);

    const { title,maxBudget,description,pickupLocation,dropLocation,weight,dimensions,vehicleType,cargoType,bidStartTime,bidEndTime} = req.body;

    if (!title || !maxBudget || !description || !pickupLocation || !dropLocation || !weight || !vehicleType || !bidStartTime || !bidEndTime) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    let images = [];

    if(req.files && req.files.length > 0){
      for(const file of req.files){
        try{
          const uploaded = await cloudinary.uploader.upload(file.path,{
          folder: "CargoSetu/Loads",
        });

        images.push({
          url: uploaded.secure_url,
          public_id: uploaded.public_id,
        });
        }
        finally{
            fs.unlinkSync(file.path);
        }
      }
    }

    const load = await Load.create({ sender: req.user._id,title,maxBudget,description,pickupLocation,dropLocation,weight,dimensions,vehicleType,
      cargoType,bidStartTime,bidEndTime,images,status: "OPEN"});

    return res.status(201).json({
      success: true,
      data: load,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to create load",
      error: error.message,
    });
  }
};

const getAllLoads = async (req, res)=>{
  try {
    const loads = await Load.find({status: { $in: ["OPEN", "BIDDING"]}}).sort({createdAt: -1}).populate("sender", "name email");

    const loadsWithDetails = loads.map((load)=>{
      return{
        ...load._doc,
        currentLowestBid: load.lowestBid?.amount ?? null,
        totalBids: load.bids?.length ?? 0,
      };
    });

    return res.status(200).json({
      success: true,
      count: loadsWithDetails.length,
      data: loadsWithDetails,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch loads",
      error: error.message,
    });
  }
};


const deleteLoad =async(req, res) =>{
  try {
    const { id } = req.params;

    const load = await Load.findById(id);
    if(!load){
      return res.status(404).json({ message: "Load not found" });
    }

    if(load.sender.toString() !== req.user._id.toString()){
      return res.status(401).json({ message: "Not authorized" });
    }

   if(load.bids && load.bids.length > 0){
  return res.status(400).json({
    message: "Cannot delete load after bids have been placed",
  });
}

    if(load.images && load.images.length>0){
      for(const img of load.images){
        if(img.public_id){
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    await load.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Load deleted successfully",
    });
  }catch (error){
    return res.status(500).json({
      message: "Failed to delete load",
      error: error.message,
    });
  }
};

const updateLoad = async (req, res)=>{
  try {
    const {id} = req.params;
    // console.log(id);

    const {title,description,pickupLocation,dropLocation,weight,vehicleType,cargoType,maxBudget,bidStartTime,bidEndTime}=req.body;

    // console.log(req.body)
    const load = await Load.findById(id);

    if(!load){
      return res.status(404).json({message: "Load not found"});
    }

    if(load.sender.toString() !== req.user._id.toString()){
      return res.status(403).json({message: "Not authorized"});
    }

    // Validate bid times
    if(bidStartTime && bidEndTime && new Date(bidEndTime) <= new Date(bidStartTime)){
      return res.status(400).json({
        message: "Bid end time must be after bid start time",
      })}

    // Prevent update if bids already placed
    if(load.bids.length > 0){
      return res.status(400).json({
        message: "Cannot update load after bids are placed",
      })}

    // Prevent update after bidding starts
    if(Date.now() >= load.bidStartTime.getTime()){
      return res.status(400).json({
        message: "Cannot update load after bidding has started",
      })}

    if(title !== undefined) load.title = title;
    if(description !== undefined) load.description = description;
    if(pickupLocation !== undefined) load.pickupLocation = pickupLocation;
    if(dropLocation !== undefined) load.dropLocation = dropLocation;
    if(weight !== undefined) load.weight = Number(weight);
    if(vehicleType !== undefined) load.vehicleType = vehicleType;
    if(cargoType !== undefined) load.cargoType = cargoType;
    if(maxBudget !== undefined && maxBudget !== ""){
        load.maxBudget = Number(maxBudget);
        }
    if(bidStartTime !== undefined) load.bidStartTime = bidStartTime;
    if(bidEndTime !== undefined) load.bidEndTime = bidEndTime;
    
       if(req.body["dimensions[length]"] !== undefined || req.body["dimensions[width]"] !== undefined || req.body["dimensions[height]"] !== undefined) {
      load.dimensions ={
        length: req.body["dimensions[length]"] || load.dimensions?.length,
        width: req.body["dimensions[width]"] || load.dimensions?.width,
        height: req.body["dimensions[height]"] || load.dimensions?.height,
      }}

    if(req.files && req.files.length > 0){
      const newImages = [];

      for(const file of req.files){
        try{
          const uploaded = await cloudinary.uploader.upload(file.path,{
            folder: "CargoSetu/Loads",
          });

          newImages.push({
            url: uploaded.secure_url,
            public_id: uploaded.public_id,
          });

        } finally {
          fs.unlinkSync(file.path);
        }
      }

      // delete old images after successful upload
      for(const img of load.images){
        if(img.public_id){
          await cloudinary.uploader.destroy(img.public_id);
        }}
      load.images = newImages;
    }
    
    console.log(load)
    await load.save();

    return res.status(200).json({
      success: true,
      data: load,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to update load",
      error: error.message,
    });
  }
};

const getAllLoadsOfUser = async (req, res)=>{
  try {
    const senderId = req.user._id;
    // Fetch loads created by this sender
    const loads = await Load.find({sender: senderId}).sort({ createdAt: -1}).populate("sender", "name email");

    const loadsWithDetails = await Promise.all(
      loads.map(async (load) =>{
        const lowestBid = await biddingLoad.findOne({ load: load._id }).sort({ amount: 1 });
        const totalBids = await biddingLoad.countDocuments({
          load: load._id,
        });
        return {
          ...load._doc,
          currentLowestBid: lowestBid ? lowestBid.amount : null,
          totalBids,
        };
      })
    );
    return res.status(200).json({
      success: true,
      count: loadsWithDetails.length,
      data: loadsWithDetails,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch user loads",
      error: error.message,
    });
  }
};


const verifyAndAddCommissionLoadByAdmin = async(req, res) =>{
  try {
    const commission = Number(req.body.commission);
    const { id } = req.params;

    if(req.body.commission == null || isNaN(commission) || commission < 0 || commission > 100){
      return res.status(400).json({
        message: "Valid commission value (0–100) is required",
      });
    }

    const load = await Load.findById(id);
    if(!load){
      return res.status(404).json({
        message: "Load not found",
      });
    }

    load.isVerified = true;
    load.adminCommission = commission;

    if(load.status === "OPEN" || !load.status){
      load.status = "OPEN";
    }

    await load.save();

    return res.status(200).json({
      success: true,
      message: "Load verified and commission applied successfully",
      data: load,
    });
  }catch (error){
    return res.status(500).json({
      message: "Failed to verify load",
      error: error.message,
    });
  }
};

const getAllLoadsByAdmin = async (req, res) =>{
  try {
    const loads = await Load.find({}).sort({createdAt: -1}).populate("sender", "name email role");

    const loadsWithDetails = await Promise.all(
      loads.map(async (load) =>{
        const lowestBid = await biddingLoad.findOne({ load: load._id }).sort({ amount: 1 });

        const totalBids = await biddingLoad.countDocuments({
          load: load._id,
        });
        return {
          ...load._doc,
          currentLowestBid: lowestBid ? lowestBid.amount : null,
          totalBids,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: loadsWithDetails.length,
      data: loadsWithDetails,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch loads for admin",
      error: error.message,
    });
  }
};


const deleteLoadsByAdmin = async (req, res)=>{
  try {
    const {loadIds} = req.body;

    if (!Array.isArray(loadIds) || loadIds.length === 0){
      return res.status(400).json({
        message: "loadIds must be a non-empty array",
      });
    }

    const loads = await Load.find({ _id: { $in: loadIds }});
    // Delete Cloudinary images
    for(const load of loads){
      if(load.images && load.images.length > 0){
        for(const img of load.images){
          if(img.public_id){
            await cloudinary.uploader.destroy(img.public_id);
          }
        }
      }
    }

    // Delete related bids
    await biddingLoad.deleteMany({load:{ $in: loadIds }});

    const result = await Load.deleteMany({_id:{ $in: loadIds }});

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} loads deleted successfully`,
    });
  }catch (error){
    return res.status(500).json({
      message: "Failed to delete loads",
      error: error.message,
    });
  }
};

const getAllCompletedLoads = async(req, res)=>{
  try {
    const loads = await Load.find({status: "COMPLETED"}).sort({createdAt: -1}).populate("sender").populate("winner");

    return res.status(200).json({
      success: true,
      count: loads.length,
      data: loads,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch completed loads",
      error: error.message,
    });
  }
};

const getLoadById = async (req, res)=>{
  try {
     const load = await Load.findById(req.params.id).populate("sender", "name email").populate("assignedDriver", "name email").populate({
        path: "bids",
        model: "Bid",                      
        populate: {path: "driver", select: "name email"},
      });

    if(!load){
      return res.status(404).json({message: "Load not found"});
    }

    res.json(load);

  } catch(error){
    res.status(500).json({ message: error.message });
  }
};

const getActiveLoads = async(req, res)=>{
  try {
    const userId = req.user._id;
    const role = req.user.role;
    let loads;

    if(role === "Sender"){
      //Sender sees their own loads that are open for bidding
      loads = await Load.find({sender: userId, status: {$in: ["OPEN", "BIDDING"] },isVerified: true}).sort({ bidEndTime: 1});
    }else if(role === "Driver"){
      // Driver sees all verified loads open for bidding
      loads = await Load.find({status: {$in: ["OPEN", "BIDDING"] }, isVerified: true}).populate("sender", "name email photo").sort({ bidEndTime: 1});
    }else{
      return res.status(403).json({message: "Access denied"});
    }

    const loadsWithDetails = await Promise.all(
      loads.map(async (load)=>{
        const lowestBid = await biddingLoad.findOne({load: load._id}).sort({amount: 1});
        const totalBids = await biddingLoad.countDocuments({load: load._id});
        return{
          ...load._doc,
          currentLowestBid: lowestBid ? lowestBid.amount : null,
          totalBids,
        };
      })
    );

    return res.status(200).json({success: true, count: loadsWithDetails.length, data: loadsWithDetails});
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch active loads", error: error.message});
  }
};

const getCompletedUserLoads = async(req, res)=>{
  try {
    const userId = req.user._id;
    const role = req.user.role;
    let loads;

    if(role === "Sender"){
      loads = await Load.find({sender: userId, status: "DELIVERED"}).populate("assignedDriver","name email phone photo vehicleType").sort({updatedAt: -1});
    }else if(role === "Driver"){
      loads = await Load.find({ assignedDriver: userId, status: "DELIVERED"}).populate("sender", "name email phone photo").sort({ updatedAt: -1});
    }else{
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json({ success: true, count: loads.length, data: loads });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch completed loads", error: error.message });
  }
};

const deleteLoadByAdmin = async(req, res)=>{
  try {
    const {id} = req.params;
    const load = await Load.findById(id);
    if(!load) return res.status(404).json({message: "Load not found"});

    if(load.images && load.images.length > 0) {
      for(const img of load.images){
        if(img.public_id){
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    await biddingLoad.deleteMany({load: id});
    await load.deleteOne();

    return res.status(200).json({ success: true, message: "Load deleted by admin" });
  }catch (error){
    return res.status(500).json({ message: "Failed to delete load", error: error.message });
  }
};

module.exports={createLoad,getAllLoads,deleteLoad,updateLoad,getAllLoadsOfUser,verifyAndAddCommissionLoadByAdmin,getAllLoadsByAdmin,deleteLoadsByAdmin,deleteLoadByAdmin,getAllCompletedLoads,getLoadById,getActiveLoads,getCompletedUserLoads};