const express = require("express");
const { auth, isAdmin, isSender } = require("../middleWare/authMiddleware");
const router = express.Router();
const { upload } = require("../utils/fileUpload");
const {createLoad,getAllLoads,deleteLoad,updateLoad,getAllLoadsOfUser,verifyAndAddCommissionLoadByAdmin,getAllLoadsByAdmin,deleteLoadsByAdmin,deleteLoadByAdmin,getAllCompletedLoads,getLoadById, getCompletedUserLoads, getActiveLoads}=require("../controllers/LoadController");

// Admin-only routes (must be defined before /:id to avoid conflicts)
router.patch("/admin/Load-verified/:id", auth, isAdmin, verifyAndAddCommissionLoadByAdmin);
router.get("/admin/all", auth, isAdmin, getAllLoadsByAdmin);
router.delete("/admin/bulk", auth, isAdmin, deleteLoadsByAdmin);
router.delete("/admin/:id", auth, isAdmin, deleteLoadByAdmin);

router.post("/", auth, isSender, upload.array("images",5), createLoad);
router.get("/", getAllLoads);
router.delete("/:id", auth, isSender, deleteLoad);
router.patch("/:id", auth, isSender, upload.array("images",5), updateLoad);
router.get("/user", auth, getAllLoadsOfUser);
router.get("/sold", getAllCompletedLoads);
router.get("/active", auth, getActiveLoads);
router.get("/completed", auth, getCompletedUserLoads);
router.get("/:id", getLoadById);

module.exports = router;