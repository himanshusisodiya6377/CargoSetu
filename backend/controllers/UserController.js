const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const bcrypt=require("bcrypt")

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const registerUser =async (req, res) => {
    // console.log(req.body);
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({
        message:"Please fill in all required fileds",
    });
  }

  const userExits = await User.findOne({ email });
  if (userExits) {
     res.status(400).json({
        message:"Email is already exit",
    });
  }

  const user = await User.create({
    name,
    email,
    password,
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
    const { _id, name, email, photo, role } = user;
    res.status(201).json({ _id, name, email, photo, token, role });
  } else {
    res.status(400).json({
        message:"User invalid data!",
    })
  }
};

const loginUser =async (req, res) => {
    console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
        message:"Please fill in all required fileds",
    });
  }

  const userExits = await User.findOne({ email });
  if (!userExits) {
     res.status(400).json({
        message:"User not found, Please signUp",
    });
  }

  const passwordIsCorrrect = await bcrypt.compare(password, userExits.password);

  const token = generateToken(userExits._id);
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  if (userExits && passwordIsCorrrect) {
    const { _id, name, email, photo, role, token } = userExits;
    res.status(201).json({ _id, name, email, photo, token, role });
  } else {
    res.status(400).json({
        message:"Invalid email or password",
    })
  }
};

const loginStatus =async (req, res) => {
    console.log(req.body);
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
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

  // Check if email and password are provided
  if (!email || !password) {
    res.status(400).json({
        message:"Please provide both email and password",
    });
  }

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({
        message:"User not found, please sign up",
    })
  }

  // Verify the password
  const passwordIsCorrect = await bcrypt.compare(password, user.password);
  if (!passwordIsCorrect) {
    res.status(400).json({
        message:"Invalid email or password",
    });
  }

  // If password is correct, update the role to 'seller'
  user.role = "Sender";
  await user.save();

  // Generate a token and set cookie
  const token = generateToken(user._id);
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });

  // Send the response with updated user info
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

// Only for admin users
const getAllUser = async (req, res) => {
  const userList = await User.find({});

  if (!userList.length) {
    return res.status(404).json({ message: "No user found" });
  }

  res.status(200).json(userList);
};

const estimateIncome = async (req, res) => {
  try {
    const admin = await User.findOne({ role: "admin" });
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

module.exports = { registerUser,loginUser,loginStatus,logoutUser,loginAsSender,getUserBalance ,getAllUser,estimateIncome};
