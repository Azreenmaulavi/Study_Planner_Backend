const express = require("express");
const {
  subscribe,
  sendNotifications,
  getUserNotifications,
  markAllAsRead
} = require("../controllers/notificationController");

const router = express.Router();

router.post("/notification/subscribe", subscribe); // Save subscription
router.post("/send", sendNotifications); // Send push notification
router.get("/user/:userId", getUserNotifications); // Fetch user notifications
router.put("/markAllAsRead/:userId", markAllAsRead); 
module.exports = router;
 