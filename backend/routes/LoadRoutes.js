const express = require("express");
const { auth, isAdmin, isSender } = require("../middleware/authMiddleware");
const router = express.Router();
const { upload } = require("../utils/fileUpload");
const {createLoad,getAllLoads,deleteLoad,updateLoad,getAllLoadsOfUser,getAllLoadsByAdmin,deleteLoadByAdmin,getLoadById, getCompletedUserLoads, getActiveLoads}=require("../controllers/LoadController");


router.get("/admin/all", auth, isAdmin, getAllLoadsByAdmin);
router.delete("/admin/:id", auth, isAdmin, deleteLoadByAdmin);

router.post("/", auth, isSender, upload.array("images",5), createLoad);
router.get("/", getAllLoads);
router.delete("/:id", auth, isSender, deleteLoad);
router.patch("/:id", auth, isSender, upload.array("images",5), updateLoad);
router.get("/user", auth, getAllLoadsOfUser);
router.get("/active", auth, getActiveLoads);
router.get("/completed", auth, getCompletedUserLoads);
router.get("/:id", getLoadById);

module.exports = router;