const CommissionConfig = require("../models/CommissionConfig");
const Payment = require("../models/Payment");

const getCommissionConfig = async (req, res) => {
  try {
    const config = await CommissionConfig.getConfig();
    return res.status(200).json({ success: true, data: config });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch commission config", error: error.message });
  }
};

const updateCommissionConfig = async (req, res) => {
  try {
    const { percentage } = req.body;
    if (percentage === undefined || percentage < 0 || percentage > 100) {
      return res.status(400).json({ message: "Commission percentage must be between 0 and 100" });
    }

    let config = await CommissionConfig.findOne();
    if (!config) {
      config = new CommissionConfig();
    }
    config.percentage = percentage;
    await config.save();

    return res.status(200).json({ success: true, message: "Commission config updated", data: config });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update commission config", error: error.message });
  }
};

const getRevenueDashboard = async (req, res) => {
  try {
    const payments = await Payment.find({ paymentStatus: "SUCCESSFUL" })
      .populate("load", "title pickupLocation dropLocation")
      .populate("sender", "name email")
      .populate("driver", "name email")
      .sort({ paidAt: -1 });

    const totalCommission = payments.reduce((sum, p) => sum + (p.commissionAmount || 0), 0);
    const totalDriverEarnings = payments.reduce((sum, p) => sum + (p.driverAmount || 0), 0);
    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalCommission,
          totalDriverEarnings,
          totalRevenue,
          totalLoads: payments.length,
        },
        payments,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch revenue data", error: error.message });
  }
};

module.exports = { getCommissionConfig, updateCommissionConfig, getRevenueDashboard };
