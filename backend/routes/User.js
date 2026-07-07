const express = require("express");
const router = express.Router();
const {auth,isAdmin}=require("../middleWare/authMiddleware");
const { upload } = require("../utils/fileUpload");
const authRateLimit = require("../middleWare/authRateLimit");
const { registerUser,loginUser,loginStatus,logoutUser,loginAsSender,getUserBalance,getUserProfile,getAllUser,estimateIncome, updateUserProfile, deleteUser, becomeSender } = require("../controllers/UserController");

router.post("/register", authRateLimit, registerUser);
router.post("/login", authRateLimit, loginUser);
router.get("/loggedin", loginStatus);
router.get("/logout", logoutUser);
router.post("/sender", authRateLimit, loginAsSender);
router.get("/sender_amount",auth, getUserBalance);
router.get("/getuser", getUserProfile);
router.get("/users", auth, isAdmin, getAllUser);
router.get("/estimate-income", auth, isAdmin, estimateIncome);
router.post("/become-sender", auth, becomeSender);
router.put("/update", auth, upload.single("photo"), updateUserProfile);
router.delete("/:id", auth, isAdmin, deleteUser);

module.exports = router;
