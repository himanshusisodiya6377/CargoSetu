const CommissionConfig = require("../models/CommissionConfig");

async function getCommissionPercentage() {
  const config = await CommissionConfig.getConfig();
  return config.percentage;
}

function calculateCommission(bidAmount, percentage) {
  const commissionAmount = Math.round((percentage / 100) * bidAmount);
  const driverAmount = bidAmount - commissionAmount;
  return { commissionAmount, driverAmount };
}

async function calculateAndSave(bidDocument, session = null) {
  const percentage = await getCommissionPercentage();
  const { commissionAmount, driverAmount } = calculateCommission(bidDocument.amount, percentage);
  bidDocument.commissionPercentage = percentage;
  bidDocument.commissionAmount = commissionAmount;
  bidDocument.driverAmount = driverAmount;
  await bidDocument.save({ session });

  return { bidAmount: bidDocument.amount, commissionPercentage: percentage, commissionAmount, driverAmount };
}

module.exports = { getCommissionPercentage, calculateCommission, calculateAndSave };
