const mongoose = require("mongoose");

// Database model for Notifications to store in the database
const NotificationSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
  notificationType: {
    type: String,
    enum: ["like", "match"],
  },
  read: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Notification", NotificationSchema);
