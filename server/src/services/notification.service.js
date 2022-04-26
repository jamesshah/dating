const Notification = require("../models/notification.model");

// Get all the notifications for the userId provided
const list = async (userId) => {
  const notifications = await Notification.find({ receiver: userId })
    .sort({
      date: "desc",
    })
    .populate(
      "sender",
      "-requests -matches -likes -__v -preferredAgeGroup -preferredPronouns -password"
    )
    .populate(
      "receiver",
      "-requests -matches -likes -__v -preferredAgeGroup -preferredPronouns -password"
    );

  // Mark all the notifications as read after fetching them from the database
  await Notification.updateMany({ receiver: userId }, { read: true });
  if (notifications) return notifications;
  return null;
};

// Get all the unread notifications for the userId provided
const listUnread = async (userId) => {
  const notifications = await Notification.find({
    receiver: userId,
    read: false,
  })
    .sort({
      date: "desc",
    })
    .populate(
      "sender",
      "-requests -matches -likes -__v -preferredAgeGroup -preferredPronouns"
    )
    .populate(
      "receiver",
      "-requests -matches -likes -__v -preferredAgeGroup -preferredPronouns"
    );

  if (notifications) return notifications;
  return null;
};

// Add a new notification in the database with the data provided
const save = async (sender, receiver, notificationType) => {
  const notification = new Notification({
    notificationType: notificationType,
    sender: sender,
    receiver: receiver,
  });

  return notification.save();
};

// Delete a notification from the database using the data provided
const remove = async (sender, receiver, notificationType) => {
  const deletedNotification = await Notification.findOneAndDelete({
    notificationType: notificationType,
    sender: sender,
    receiver: receiver,
  });

  return deletedNotification;
};

// Marking all the notifications as read for the provided user
const markRead = async (receiver) => {
  const notifications = await Notification.updateMany(
    { receiver: receiver, read: false },
    { read: true },
    { new: true }
  );

  if (notifications) return notifications;
  else return null;
};

module.exports = {
  list,
  listUnread,
  save,
  remove,
  markRead,
};
