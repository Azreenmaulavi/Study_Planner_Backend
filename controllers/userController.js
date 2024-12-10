const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const path = require('path');
const otpGenerator = require("otp-generator");
const {sendOtp } = require("./mailController");

//Reset password                     
exports.resetPassword = async (req, res) => {
    try {
      // const userId = req.params.id;
      const { email, newPassword } = req.body;
  
      // Find the user by userId
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, error: "User not found." });
      }
  
      // Check if the new password meets the minimum length requirement
      if (newPassword.length < 5) {
        return res.status(400).json({
          success: false,
          error: "Password must be at least 5 characters long.",
        });
      }
  
      // Generate a salt and hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      // Update the user's password
      user.password = hashedPassword;
      await user.save();
  
      // Password reset successful
      return res
        .status(200)
        .json({ success: true, message: "Password reset successful." });
    } catch (error) {
      console.error("Error resetting password:", error);
      return res.status(500).json({
        success: false,
        error: "An error occurred. Please try again later.",
      });
    }
  };
  
  //Generate OTP                       
 exports.otpGenerate = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Find user by email and select the name field
      const user = await User.findOne({ email }).select("name");
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const name = user.name;
  
      // Generate OTP
      const otp = otpGenerator.generate(6, {
        upperCase: false,
        specialChars: false,
        digits: true,
        alphabets: false,
      });
  
      // Update user's record with the OTP and save it
      user.otp = otp;
      await user.save();
  
      // Send OTP to the user's email
      const result = await sendOtp(name, email, otp);
      // console.log(result);
      // Check if the OTP sending was successful
      res.status(201).json({
        success: true,
        message: "OTP send successfully",
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ error: "An error occurred while sending OTP" });
    }
  };
  
  //verify OTP                         
 exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      // Find the user by email in the database
      const user = await User.findOne({ email });
  
      // If user not found, return error
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Check if OTP matches
      if (!user.otp || user.otp.trim() !== otp.trim()) {
        return res.status(400).json({ error: "Invalid OTP" });
      }
  
      // Clear the OTP from the user's record
      user.otp = null; // Assuming you have a field to store the OTP in your User model
      await user.save();
  
      // Respond with success message
      return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while verifying OTP" });
    }
  };


  
  // Update Profile Picture and Email
  exports.updateUser = async (req, res) => {
    const userId = req.params.userId; // Get user ID from URL parameters
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update fields if provided
      if (req.file) {
        const profilePicturePath = path.join('uploads', req.file.filename);
        user.profilePicture = profilePicturePath;
      }
  
      if (req.body.email) {
        user.email = req.body.email;
      }
  
      await user.save();
  
      return res.status(200).json({
        success: true,
        message: 'Profile picture and email updated successfully',
        profilePicture: user.profilePicture,
        email: user.email,
      });
    } catch (error) {
      console.error('Error updating profile picture and email:', error);
      return res.status(500).json({ error: 'An error occurred while updating the profile picture and email' });
    }
  };
  
  // Get User Profile
exports.getUserProfile = async (req, res) => {
  const userId = req.params.userId; // Get userId from URL parameter

  try {
    // Find user by userId
    const user = await User.findById(userId).select('name email profilePicture'); // Only select relevant fields

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user profile data including profile picture URL
    return res.status(200).json({
      message: 'User profile retrieved successfully',
      data: user,
    });
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Server-side controller
exports.updateStudyTime = async (req, res) => {
  const { userId } = req.params;
  const { timeSpent } = req.body;

  try {
    // Update total study time for the user in the database
    const user = await User.findById(userId);
    user.totalStudyTime += timeSpent;
    await user.save();

    res.json({ totalStudyTime: user.totalStudyTime });
  } catch (error) {
    res.status(500).json({ error: "Failed to update study time" });
  }
};
 exports.getStudyTime = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID and return only the totalStudyTime field
    const user = await User.findById(userId, 'totalStudyTime');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ totalStudyTime: user.totalStudyTime });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch study time" });
  }
};