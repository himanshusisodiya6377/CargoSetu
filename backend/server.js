const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const User = require("./routes/User");
const Load = require("./routes/LoadRoutes.js");
const biddingRoutes=require("./routes/biddingRoutes.js")


const app = express();

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Home Pages");
});


//Routes Middleware

app.use("/api/users",User);
app.use("/api/Loads",Load);
app.use("/api/bidding", biddingRoutes);





const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});


