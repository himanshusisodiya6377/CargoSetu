const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    if (!options.email) {
      throw new Error("No recipient email provided");
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error("Email sending error:", error.message);
    console.error("Error details:", error);
    throw error;
  }
};

module.exports = sendEmail;
