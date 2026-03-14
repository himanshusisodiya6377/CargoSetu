const sendEmail = require("../utils/sendEmail");

const sendBidWonEmail = async ({ driver, load, finalAmount })=>{
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
};

const sendLoadAssignedEmail = async ({ sender, driver, load, finalAmount })=>{
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
};

const sendDeliveryConfirmationEmail = async ({sender, load}) =>{
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
};


module.exports = {sendBidWonEmail,sendLoadAssignedEmail,sendDeliveryConfirmationEmail};
