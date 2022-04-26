const Message = require("../models/message.model");

// Get all the messages for the sender and receiver provided
const list = async (from, to) => {
  const messages = await Message.find({
    users: {
      $all: [from, to],
    },
  }).sort({
    updatedAt: 1,
  });

  // Add a field called fromSelf to identify if the message is sent by the logged in user or the receiver
  const formattedMessages = messages.map((msg) => {
    return {
      fromSelf: msg.sender.toString() === from,
      message: msg.message.text,
      date: msg.updatedAt,
    };
  });

  // Returning the messages object to the controller
  if (formattedMessages) return formattedMessages;
  return null;
};

// Save a new message to the database
const save = async (from, to, message) => {
  const data = await Message.create({
    message: { text: message },
    users: [from, to],
    sender: from,
  });

  // Return the new message created to controller
  if (data) return data;
  return null;
};

module.exports = {
  list,
  save,
};
