const mongoose = require("mongoose");

const loadSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    maxBudget: {
      type: Number,
      required: true
   },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    description: {
      type: String,
      required: true,
      trim: true,
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    dropLocation: {
      type: String,
      required: true,
    },
    deliveryDate: Date,
    weight: {
      type: Number,
      required: true,
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    vehicleType: {
      type: String,
      enum: ["BIKE", "AUTO", "MINI_TRUCK", "TRUCK", "CONTAINER", "TRAILER"],
      required: true,
    },
    cargoType: {
      type: String,
      enum: ["GENERAL", "FRAGILE", "LIQUID", "PERISHABLE", "HEAVY", "HAZARDOUS"],
      default: "General",
    },
    bidDuration: {
      type: Number,
      default: 60,
    },
    bidStartTime: {
      type: Date,
    },
    bidEndTime: {
      type: Date,
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    adminCommission: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["OPEN", "BIDDING", "PAYMENT_PENDING", "ASSIGNED", "ENDED", "IN_TRANSIT", "DELIVERED"],
      default: "OPEN",
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Load", loadSchema);
