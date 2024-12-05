const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // App Password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender's email
      to, // Recipient's email
      subject, // Subject of the email
      text, // Body of the email
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send email"); // Re-throw the error for further handling
  }
};
const sendOtp = async (name, email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Verification",
      text: `Hello ${name},\n\nYour OTP is: ${otp}.\n\nThank you!`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully to", email);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};
module.exports = {sendEmail,sendOtp};
