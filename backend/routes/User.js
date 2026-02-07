const express = require("express");
const router = express.Router();
const {auth,isAdmin}=require("../middleWare/authMiddleware");

const { registerUser,loginUser,loginStatus,logoutUser,loginAsSender,getUserBalance,getAllUser,estimateIncome } = require("../controllers/UserController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/loggedin", loginStatus);
router.get("/logout", logoutUser);
router.post("/sender", loginAsSender);
router.get("/sender_amount",auth, getUserBalance);
router.get("/users", auth, isAdmin, getAllUser);
router.get("/estimate_income", auth, isAdmin, estimateIncome);


module.exports = router;
