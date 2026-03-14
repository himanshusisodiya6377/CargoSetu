const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const UserRoutes = require("./routes/User");
const LoadRoutes = require("./routes/LoadRoutes.js");
const LoadModel = require("./models/Load");
const cron = require("node-cron");
const BiddingLoad = require("./models/biddingLoad");
const biddingRoutes = require("./routes/biddingRoutes.js");
const contactRoutes = require("./routes/contactRoutes.js");
const { sendBidWonEmail, sendLoadAssignedEmail } = require("./services/biddingEmailService");
const dns = require("dns");

dns.setServers(["1.1.1.1","8.8.8.8"]);

const app = express();

require("dotenv").config();


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


cron.schedule("* * * * *",async ()=>{
  try{
    const now = new Date();
    //Find loads that ended but haven't been assigned yet and have bids
    const expiredLoads = await LoadModel.find({
      status:"OPEN",
      bidEndTime:{$lte: now}}).populate("sender","name email");

    for(const load of expiredLoads){
      const winningBid = await BiddingLoad.findOne({load:load._id}).sort({amount:1}).populate("driver","name email");

      if(!winningBid){
        load.status = "BIDDING";
        await load.save();
        console.log(`Load ${load._id} expired with no bids`);
        continue;
      }

      const commissionAmount = (load.adminCommission/100)*winningBid.amount;
      const finalAmount = winningBid.amount-commissionAmount;

      load.status ="ASSIGNED";
      load.assignedDriver =winningBid.driver._id;
      await load.save();

      await BiddingLoad.updateMany(
        {load:load._id, _id:{ $ne: winningBid._id }},
        {status:"LOST"});
      winningBid.status = "WON";
      await winningBid.save();

      try{
        await sendBidWonEmail({driver:winningBid.driver,load,finalAmount});
        await sendLoadAssignedEmail({sender:load.sender,driver:winningBid.driver,load,finalAmount});
      } catch (err) {
        console.error(`Email failed for load ${load._id}:`,err.message);
      }
      console.log(`Auto-assigned load ${load._id} to driver ${winningBid.driver.name}`);
    }
  } catch (err) {
    console.error("Cron job error:",err.message);
  }
});


const PORT =process.env.PORT || 5000;

app.listen(PORT,() =>{
  console.log(`Server running on port ${PORT}`)
});


