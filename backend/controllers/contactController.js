const sendEmail = require("../utils/sendEmail");

const submitContact = async (req, res)=>{
  try{
    const {name, email, phone, subject, message} = req.body;

    if(!name || !email || !subject || !message){
      return res.status(400).json({ message: "Name, email, subject, and message are required." });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
      return res.status(400).json({message: "Invalid email address."});
    }

    if(message.length > 2000){
      return res.status(400).json({message: "Message must be under 2000 characters."});
    }

    // Send notification email to admin/support
    await sendEmail({
      email: process.env.SMTP_FROM_EMAIL,
      subject: `[CargoSetu Contact] ${subject}`,
      message: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\nSubject: ${subject}\n\nMessage:\n${message}`,
    });

    // Send acknowledgement email to the user
    await sendEmail({
      email,
      subject: "We received your message — CargoSetu",
      message: `Hi ${name},\n\nThank you for reaching out to CargoSetu. We have received your message and will get back to you within 24–48 hours.\n\nYour message:\n"${message}"\n\nBest regards,\nThe CargoSetu Team`,
    });

    return res.status(200).json({
      success: true,
      message: "Your message has been sent. We'll get back to you shortly.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to send message. Please try again later.",
      error: error.message,
    });
  }
};

module.exports = { submitContact };
