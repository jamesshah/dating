const LOGGER = require("../util/logger");
const notificationService = require("../services/notification.service");
const asyncHandler = require("express-async-handler");

// @desc    Get all the notifications for the authorized user
// @route   GET /api/notifications
// @access  Private
const getAllNotifications = asyncHandler(async (req, res) => {
  LOGGER.info("getAllNotifications: [GET] /api/notifications");
  try {
    const notifications = await notificationService.list(req.user._id);
    LOGGER.info("Fetched notifications, sending response");
    return res.status(200).json(notifications);
  } catch (error) {
    res.status(500);
    LOGGER.error(error);
    throw new Error("Could not fetch notifications, please try again");
  }
});

// @desc    Get the unread notifications for the authorized user
// @route   GET /api/notifications/unread
// @access  Private
const getUnreadNotifications = asyncHandler(async (req, res) => {
  LOGGER.info("getUnreadNotifications: [GET] /api/notifications/unread");
  try {
    const notifications = await notificationService.listUnread(req.user._id);
    LOGGER.info("Fetched unread notifications, sending response");
    return res.status(200).json(notifications);
  } catch (error) {
    LOGGER.error(error);
    res.status(500);
    throw new Error("Could not fetch unread notifications, please try again");
  }
});

/**
 * @description Mark all notifications as read for authorized user
 */
const markAllNotificationsRead = asyncHandler(async (req, res) => {
  LOGGER.info("inside markAllNotificationsRead");
  try {
    const notifications = await notificationService.markRead(req.user._id);
    return res.status(200).json(notifications);
  } catch (error) {
    LOGGER.error(error);
    res.status(500);
    throw new Error("Could not mark notifications as read, please try again");
  }
});

/**
 * @description Create a new notification for like or match user
 */
const createNotification = async (senderId, receiverId, notificationType) => {
  LOGGER.info("createNotification: called from likeUser/ matchUser");
  const notification = await notificationService.save(
    senderId,
    receiverId,
    notificationType
  );

  console.log(notification);

  if (notification) return notification;
  else return null;
};

/**
 * @description Delete a notification
 */
const deleteNotification = async (senderId, receiverId, notificationType) => {
  LOGGER.info("createNotification: called from dislikeUser / dismatchUser");
  const notification = await notificationService.remove(
    senderId,
    receiverId,
    notificationType
  );

  if (notification) return notification;
  else return null;
};

module.exports = {
  getAllNotifications,
  getUnreadNotifications,
  createNotification,
  deleteNotification,
  markAllNotificationsRead,
};
