const router = require("express").Router();
const messageController = require("../controllers/message.controller");
const { authorize } = require("../middlewares/authMiddleware");

router
  .post("/add", authorize, messageController.addMessage) // Route to add a new message
  .post("/get", authorize, messageController.getMessages); // Route to get all the messages

module.exports = router;
