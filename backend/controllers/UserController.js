const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const cloudinary = require("../config/cloudinary.js");
const { validatePassword } = require("../utils/passwordValidation");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const registerUser =async(req, res) =>{
    // console.log(req.body);
  const { name, email, password, role } = req.body;
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!name || !normalizedEmail || !password) {
    return res.status(400).json({
        message:"Please fill in all required fileds",
    });
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return res.status(400).json({
      message: passwordValidation.errors[0],
      errors: passwordValidation.errors,
    });
  }

  const userExits = await User.findOne({ email: normalizedEmail });
  if (userExits) {
     return res.status(400).json({
        message:"Email is already registered.",
    });
  }

  const allowedRoles = ["Sender", "Driver"];
  const userRole = allowedRoles.includes(role) ? role : "Driver";

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    role: userRole,
  });

  const token = generateToken(user._id);
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name: userName, email: userEmail, photo, role: userRole } = user;
    res.status(201).json({ _id, name: userName, email: userEmail, photo, token, role: userRole });
  } else {
    res.status(400).json({
        message:"User invalid data!",
    })
  }
};

const loginUser =async(req, res) =>{
  const { email, password } = req.body;
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!normalizedEmail || !password) {
    return res.status(400).json({
        message:"Invalid email or password",
    });
  }

  const userExits = await User.findOne({ email: normalizedEmail });
  if (!userExits) {
     return res.status(400).json({
        message:"Invalid email or password",
    });
  }

  const passwordIsCorrrect = await bcrypt.compare(password, userExits.password);

  if (!passwordIsCorrrect) {
    return res.status(400).json({
      message:"Invalid email or password",
    });
  }

  const token = generateToken(userExits._id);
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  const { _id, name, email: userEmail, photo, role } = userExits;
  res.status(200).json({ _id, name, email: userEmail, photo, token, role });
};

const loginStatus = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified) {
      return res.json(true);
    }
    return res.json(false);
  } catch (error) {
    return res.json(false);
  }
};

const logoutUser =async (req, res) => {
   res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Successfully Logged Out" });
};

const loginAsSender =async (req, res) => {
   const { email, password } = req.body;
   const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

  // Check if email and password are provided
  if (!normalizedEmail || !password) {
    return res.status(400).json({
        message:"Invalid email or password",
    });
  }

  // Find the user by email
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    return res.status(404).json({
        message:"Invalid email or password",
    });
  }

  // Verify the password
  const passwordIsCorrect = await bcrypt.compare(password, user.password);
  if (!passwordIsCorrect) {
    return res.status(400).json({
        message:"Invalid email or password",
    });
  }

  // Check if user's role is Sender
  if (user.role !== "Sender") {
    return res.status(403).json({
        message:"Invalid email or password",
    });
  }

  // Generate a token and set cookie
  const token = generateToken(user._id);
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });

  // Send the response with user info
  const { _id, name, email: userEmail, photo, role } = user;
  res.status(200).json({ _id, name, email: userEmail, photo, role, token });
};

const getUserBalance = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
        message:"User not found",
    })
}

  return res.status(200).json({
    balance: user.balance,
  });
};

const getUserProfile = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Only for admin users
const getAllUser = async (req, res) => {
  const userList = await User.find({}).select("-password -__v");
  // console.log(userList)

  if (!userList.length) {
    return res.status(404).json({ message: "No user found" });
  }

  res.status(200).json(userList);
};

const estimateIncome = async (req, res) => {
  try {
    const admin = await User.findOne({ role: "Admin" });
    if (!admin) {
      return res.status(404).json({ error: "Admin user not found" });
    }
    const commissionBalance = admin.commissionBalance;
    res.status(200).json({ commissionBalance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, phone } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;

    // Handle photo upload
    if (req.file) {
      // Delete old photo from cloudinary if it exists and is not the default
      if (user.photo && user.photoPublicId) {
        await cloudinary.uploader.destroy(user.photoPublicId);
      }

      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "CargoSetu/Profiles",
      });

      fs.unlinkSync(req.file.path); // remove temp file

      user.photo = uploaded.secure_url;
      user.photoPublicId = uploaded.public_id;
    }

    const updated = await user.save();
    const { _id, name: n, email, photo, role, phone: ph } = updated;

    return res.status(200).json({ _id, name: n, email, photo, role, phone: ph });
  } catch (error) {
    if (req.file?.path) fs.unlinkSync(req.file.path); // cleanup on error
    return res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user._id.toString() === id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.photo && user.photoPublicId) {
      await cloudinary.uploader.destroy(user.photoPublicId);
    }

    await user.deleteOne();
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
};

module.exports = { registerUser,loginUser,loginStatus,logoutUser,loginAsSender,getUserBalance,getUserProfile ,getAllUser,estimateIncome,updateUserProfile,deleteUser};
