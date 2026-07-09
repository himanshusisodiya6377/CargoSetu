const express = require("express");
const { auth, isAdmin } = require("../middleware/authMiddleware");
const { getCommissionConfig, updateCommissionConfig, getRevenueDashboard } = require("../controllers/commissionController");
const router = express.Router();

router.get("/config", getCommissionConfig);
router.put("/config", auth, isAdmin, updateCommissionConfig);
router.get("/revenue", auth, isAdmin, getRevenueDashboard);

module.exports = router;
