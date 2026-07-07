require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const UserRoutes = require("./routes/User");
const LoadRoutes = require("./routes/LoadRoutes.js");
const LoadModel = require("./models/Load");
const cron = require("node-cron");
const BiddingLoad = require("./models/biddingLoad");
const { calculateAndSave } = require("./utils/commission");
const biddingRoutes = require("./routes/biddingRoutes.js");
const contactRoutes = require("./routes/contactRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");
const commissionRoutes = require("./routes/commissionRoutes.js");
const dns = require("dns");

dns.setServers(["1.1.1.1","8.8.8.8"]);

const app = express();


app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Routes
app.get("/", (req, res) =>{
  res.send("Home Pages");
});

//Routes Middleware

app.use("/api/users", UserRoutes);
app.use("/api/Loads", LoadRoutes);
app.use("/api/bidding", biddingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/commission", commissionRoutes);

app.use(errorHandler);


cron.schedule("* * * * *",async ()=>{
  try{
    const now = new Date();

    // Start bidding for loads whose bidStartTime has arrived
    const startedLoads = await LoadModel.find({
      status: "OPEN",
      bidStartTime: { $lte: now }
    });

    for(const load of startedLoads){
      load.status = "BIDDING";
      await load.save();
      console.log(`Load ${load._id} bidding started`);
    }

    // End bidding or set payment pending for loads whose bidEndTime has passed
    const expiredLoads = await LoadModel.find({
      status: "BIDDING",
      bidEndTime: { $lte: now }
    });

    for(const load of expiredLoads){
      const winningBid = await BiddingLoad.findOne({load:load._id}).sort({amount:1});

      if(!winningBid){
        load.status = "ENDED";
        await load.save();
        console.log(`Load ${load._id} ended with no bids`);
        continue;
      }

      load.status = "PAYMENT_PENDING";
      load.assignedDriver = winningBid.driver._id;
      await load.save();

      await BiddingLoad.updateMany(
        {load:load._id, _id:{ $ne: winningBid._id }},
        {status:"LOST"});
      winningBid.status = "WON";
      const cronCommission = await calculateAndSave(winningBid);
      load.adminCommission = cronCommission.commissionPercentage;

      console.log(`Load ${load._id} awaiting payment from sender`);
    }
  } catch (err) {
    console.error("Cron job error:",err.message);
  }
});


const PORT =process.env.PORT || 5000;

app.listen(PORT,() =>{
  console.log(`Server running on port ${PORT}`)
});


