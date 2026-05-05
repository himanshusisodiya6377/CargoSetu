const sendEmail = require("../utils/sendEmail");

const sendBidPlacedEmail = async ({ driver, load, bidAmount })=>{
  try {
    console.log("📧 Sending bid placed email to:", driver?.email);
    await sendEmail({
      email: driver.email,   
      subject: "📝 Your bid has been placed",
      message: `
Hello ${driver.name},

Your bid for "${load.title}" has been successfully placed.

Bid Amount: ₹${bidAmount}
Route: ${load.pickupLocation} → ${load.dropLocation}
Bidding ends: ${new Date(load.bidEndTime).toLocaleString()}

Check back to see if you win this bid!

– CargoSetu Team
    `,
    });
    console.log("✅ Bid placed email sent to:", driver?.email);
  } catch (error) {
    console.error(`❌ Failed to send bid placed email:`, error.message);
  }
};

const sendBidWonEmail = async ({ driver, load, finalAmount })=>{
  try {
    console.log("📧 Sending bid won email to:", driver?.email);
    if (!driver?.email) {
      console.error("❌ Driver email missing:", driver);
      return;
    }
    await sendEmail({
      email: driver.email,   
      subject: "🎉 You won the bid!",
      message: `
Hello ${driver.name},

Congratulations! You won the bid for "${load.title}".

Final Amount: ₹${finalAmount}

– CargoSetu Team
    `,
    });
    console.log("✅ Bid won email sent to:", driver?.email);
  } catch (error) {
    console.error(`❌ Failed to send bid won email:`, error.message);
  }
};

const sendLoadAssignedEmail = async ({ sender, driver, load, finalAmount })=>{
  try {
    console.log("📧 Sending load assigned email to:", sender?.email);
    if (!sender?.email) {
      console.error("❌ Sender email missing:", sender);
      return;
    }
    await sendEmail({
      email: sender.email,  
      subject: "🚚 Load assigned successfully",
      message: `
Hello ${sender.name},

Your load "${load.title}" has been assigned to ${driver.name}.
Final Amount: ₹${finalAmount}

– CargoSetu Team
    `,
    });
    console.log("✅ Load assigned email sent to:", sender?.email);
  } catch (error) {
    console.error(`❌ Failed to send load assigned email:`, error.message);
  }
};

const sendDeliveryConfirmationEmail = async ({sender, load}) =>{
  try {
    console.log("📧 Sending delivery confirmation email to:", sender?.email);
    await sendEmail({
      email: sender.email,
      subject: "✅ Your load has been delivered!",
      message: `
Hello ${sender.name},

Great news! Your load "${load.title}" has been successfully delivered.

Route: ${load.pickupLocation} → ${load.dropLocation}
Delivery Date: ${new Date().toDateString()}

Thank you for using CargoSetu!
– CargoSetu Team
    `,
    });
    console.log("✅ Delivery confirmation email sent to:", sender?.email);
  } catch (error) {
    console.error(`❌ Failed to send delivery confirmation email:`, error.message);
  }
};


module.exports = {sendBidPlacedEmail, sendBidWonEmail, sendLoadAssignedEmail, sendDeliveryConfirmationEmail};
