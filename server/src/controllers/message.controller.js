const asyncHandler = require("express-async-handler");
const messageService = require("../services/message.services");
const mongoose = require("mongoose");
const LOGGER = require("../util/logger");
const {
  validateMessageInput,
  validateGetMessageInput,
} = require("../util/validation");

// @desc    Add a new message to the database
// @route   POST /api/messages/add
// @access  Private
const addMessage = asyncHandler(async (req, res) => {
  LOGGER.info("addMessage: [POST] /api/messages/add");

  const errors = validateMessageInput(req.body);
  if (Object.entries(errors).length !== 0) {
    LOGGER.error("Required field missing");
    res.status(400).json(errors);
    throw new Error(errors);
  } else {
    const { from, to, message } = req.body;
    if (
      req.user.matches &&
      req.user.matches.length !== 0 &&
      req.user.matches.some((match) => match._id.toString() === to)
    ) {
      const data = await messageService.save(from, to, message);
      if (data) {
        LOGGER.info("Message added in the database");
        return res.json({ msg: "Message added successfully." });
      }
      LOGGER.error("Message added in the database");
      return res.json({ msg: "Failed to add message to the database." });
    } else {
      LOGGER.error(
        "Cannot send message. Receiver is not in matches for sender"
      );
      throw new Error(
        "Cannot send message. Receiver is not in matches for sender"
      );
    }
  }
});

// @desc    Get all messages from  the database for the authorized user
// @route   POST /api/messages/get
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
  LOGGER.info("addMessage: [POST] /api/messages/get");

  const errors = validateGetMessageInput(req.body);
  if (Object.entries(errors).length !== 0) {
    LOGGER.error("Required field missing");
    res.status(400).json(errors);
    throw new Error(errors);
  } else {
    LOGGER.info("Fetching messages from the database");
    const { from, to } = req.body;
    const messages = await messageService.list(from, to);
    LOGGER.info("Messages fetched, sending in the response");
    return res.json(messages);
  }
});

module.exports = {
  addMessage,
  getMessages,
};
