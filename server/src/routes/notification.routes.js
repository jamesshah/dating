const express = require("express");
const notificationController = require("../controllers/notification.controller");
const { authorize } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router
  .get("/", authorize, notificationController.getAllNotifications) // Route to get all the notifications
  .get("/unread", authorize, notificationController.getUnreadNotifications); // Route to get unread notifications;

module.exports = router;
