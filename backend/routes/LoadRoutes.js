const express = require("express");
const { auth, isAdmin, isSender } = require("../middleWare/authMiddleware");
const router = express.Router();
const { upload } = require("../utils/fileUpload");
const {createLoad,getAllLoads,deleteLoad,updateLoad,getAllLoadsOfUser,verifyAndAddCommissionLoadByAdmin,getAllLoadsByAdmin,deleteLoadsByAdmin,getAllCompletedLoads}=require("../controllers/LoadController");

router.post("/", auth,isSender,upload.array("images", 5),createLoad);
router.get("/", getAllLoads);
router.delete("/:id", auth, isSender, deleteLoad);
router.put("/:id", auth, isSender, upload.array("images",5), updateLoad);
router.get("/user", auth, getAllLoadsOfUser);
router.get("/sold", getAllCompletedLoads);

// Only access for admin users
router.patch("/admin/Load-verified/:id", auth, isAdmin, verifyAndAddCommissionLoadByAdmin);
router.get("/admin/Loads", auth, isAdmin, getAllLoadsByAdmin);
router.delete("/admin/Loads", auth, isAdmin, deleteLoadsByAdmin);

module.exports = router;