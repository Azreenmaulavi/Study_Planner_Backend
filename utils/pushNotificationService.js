// utils/pushNotificationService.js

const webPush = require('web-push');
require('dotenv').config();


// Setting up VAPID keys
const vapidKeys = webPush.generateVAPIDKeys();
webPush.setVapidDetails(
 `mailto:${process.env.EMAIL_USER}`,  // Replace with your email address
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Function to send a push notification
const sendPushNotification = (subscription, payload) => {
  webPush.sendNotification(subscription, payload)
    .catch(error => {
      console.error("Error sending push notification:", error);
    });
};

module.exports = { sendPushNotification };
