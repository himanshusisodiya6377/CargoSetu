const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema(
  {
    load: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Load",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "WON", "LOST"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

bidSchema.index({ load: 1, amount: 1 }); // fastest lowest-bid lookup
bidSchema.index({ driver: 1 });

module.exports = mongoose.model("Bid", bidSchema);
