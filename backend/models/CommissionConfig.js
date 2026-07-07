const mongoose = require("mongoose");

const commissionConfigSchema = new mongoose.Schema(
  {
    percentage: {
      type: Number,
      required: true,
      default: 5,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

commissionConfigSchema.statics.getConfig = async function () {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({ percentage: parseFloat(process.env.COMMISSION_PERCENTAGE) || 5 });
  }
  return config;
};

module.exports = mongoose.model("CommissionConfig", commissionConfigSchema);
