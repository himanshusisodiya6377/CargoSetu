const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const auth = async (req, res, next) =>{
  try {
    const bearerToken = req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;
    const token = req.cookies.token || bearerToken;
    if (!token) {
      return res.status(401).json({
        message:"Not authorized, Please Login",
    })
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verified.id).select("-password");
    if (!user) {
      return res.status(401).json({
      message:"User not found",
    });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
        message:"Not authorized, Please Login",
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    return res.status(403).json({
        message:"Access denied. You are not an admin",
    });
  }
};

const isDriver = (req, res, next) =>{
  if (req.user && req.user.role === "Driver") {
    next();
  } else {
    return res.status(403).json({
        message:"Access denied. You are not an admin",
    });
  }
};

const isSender = (req, res, next) =>{
  if(req.user && req.user.role === "Sender"){
    next();
  } else {
    return res.status(403).json({
        message:"Access denied. You are not a sender"
    });
  }
};

module.exports = { auth, isAdmin, isSender,isDriver };