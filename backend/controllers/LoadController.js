const Load = require("../models/Load");
const cloudinary = require("../config/cloudinary.js");
const fs = require("fs");
const biddingLoad=require("../models/biddingLoad.js")

const createLoad = async(req, res) =>{
  try {
    const { title,description,pickupLocation,dropLocation,weight,vehicleType,cargoType,bidStartTime,bidEndTime} = req.body;

    if (!title || !description || !pickupLocation || !dropLocation || !weight || !vehicleType || !bidStartTime || !bidEndTime) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    let images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try{
          const uploaded = await cloudinary.uploader.upload(file.path, {
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

    const load = await Load.create({ sender: req.user._id,title,description,pickupLocation,dropLocation,weight,vehicleType,
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

const getAllLoads = async (req, res) => {
  try {
    const loads = await Load.find({}).sort({ createdAt: -1 }).populate("sender", "name email");

    const loadsWithDetails = await Promise.all(
      loads.map(async (load) => {
        // Lowest bid wins in CargoSetu
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
      message: "Failed to fetch loads",
      error: error.message,
    });
  }
};


const deleteLoad =async(req, res) =>{
  try {
    const { id } = req.params;

    const load = await Load.findById(id);
    if (!load) {
      return res.status(404).json({ message: "Load not found" });
    }

    if (load.sender.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (new Date() >= new Date(load.bidStartTime)) {
      return res.status(400).json({
        message: "Cannot delete load after bidding has started",
      });
    }

    if (load.images && load.images.length>0) {
      for (const img of load.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    await load.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Load deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete load",
      error: error.message,
    });
  }
};

const updateLoad = async(req, res) =>{
  try {
    const { id } = req.params;

    const load = await Load.findById(id);
    if (!load) {
      return res.status(404).json({message:"Load not found"});
    }

    if (load.sender.toString() !== req.user._id.toString()){
      return res.status(401).json({ message:"Not authorized" });
    }

    if (new Date() >= new Date(load.bidStartTime)){
      return res.status(400).json({
        message:"Cannot update load after bidding has started",
      });
    }

    const {title,description,pickupLocation,dropLocation,weight,vehicleType,cargoType} = req.body;

    load.title = title || load.title;
    load.description = description || load.description;
    load.pickupLocation = pickupLocation || load.pickupLocation;
    load.dropLocation = dropLocation || load.dropLocation;
    load.weight = weight ? Number(weight) : load.weight;
    load.vehicleType = vehicleType || load.vehicleType;
    load.cargoType = cargoType || load.cargoType;

    if (req.files && req.files.length > 0) {
      for (const img of load.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

      load.images = [];

      for (const file of req.files) {
        try {
          const uploaded = await cloudinary.uploader.upload(file.path, {
            folder:"CargoSetu/Loads",
          });

          load.images.push({
            url: uploaded.secure_url,
            public_id: uploaded.public_id,
          });
        } finally {
          fs.unlinkSync(file.path);
        }
      }
    }

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

const getAllLoadsOfUser = async (req, res) => {
  try {
    const senderId = req.user._id;
    // Fetch loads created by this sender
    const loads = await Load.find({ sender: senderId })
      .sort({ createdAt: -1 })
      .populate("sender", "name email");

    const loadsWithDetails = await Promise.all(
      loads.map(async (load) => {
       
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
    const { commission } = req.body;
    const { id } = req.params;

    if (commission === undefined || commission < 0) {
      return res.status(400).json({
        message: "Valid commission value is required",
      });
    }

    const load = await Load.findById(id);
    if (!load) {
      return res.status(404).json({
        message: "Load not found",
      });
    }

    load.isVerified = true;
    load.adminCommission = commission;

    if (load.status === "OPEN" || !load.status) {
      load.status = "OPEN";
    }

    await load.save();

    return res.status(200).json({
      success: true,
      message: "Load verified and commission applied successfully",
      data: load,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to verify load",
      error: error.message,
    });
  }
};

const getAllLoadsByAdmin = async (req, res) => {
  try {
    const loads = await Load.find({}).sort({ createdAt: -1 }).populate("sender", "name email role");

    const loadsWithDetails = await Promise.all(
      loads.map(async (load) => {
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


const deleteLoadsByAdmin = async (req, res) => {
  try {
    const { loadIds } = req.body;

    if (!Array.isArray(loadIds) || loadIds.length === 0) {
      return res.status(400).json({
        message: "loadIds must be a non-empty array",
      });
    }

    const loads = await Load.find({ _id: { $in: loadIds } });
    // Delete Cloudinary images
    for (const load of loads) {
      if (load.images && load.images.length > 0) {
        for (const img of load.images) {
          if (img.public_id) {
            await cloudinary.uploader.destroy(img.public_id);
          }
        }
      }
    }

    // Delete related bids
    await biddingLoad.deleteMany({ load: { $in: loadIds } });

    const result = await Load.deleteMany({ _id: { $in: loadIds } });

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} loads deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete loads",
      error: error.message,
    });
  }
};

const getAllCompletedLoads = async (req, res) => {
  try {
    const loads = await Load.find({ status: "COMPLETED" }).sort({ createdAt: -1 }).populate("sender").populate("winner");

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



module.exports={createLoad,getAllLoads,deleteLoad,updateLoad,getAllLoadsOfUser,verifyAndAddCommissionLoadByAdmin,getAllLoadsByAdmin,deleteLoadsByAdmin,getAllCompletedLoads};