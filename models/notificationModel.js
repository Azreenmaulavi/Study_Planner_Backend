const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Make sure this is the correct model reference (should be 'User' if that's your user model)
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String, 
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
