const express = require("express");
const userController = require("../controllers/user.controller");
const { authorize } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router
  .get("/", authorize, userController.getAllUsers)
  .post("/", userController.createNewUser)
  .get("/profile", authorize, userController.getUserProfile)
  .put("/profile", userController.updateUserProfile)
  .post("/login", userController.authUser)
  .get("/logout", userController.logoutUser)
  .post("/like", userController.likeUser)
  .put("/like", userController.dislikeUser)
  .get("/:username", authorize, userController.getUserByUsername)
  .delete("/:username", userController.deleteUser);

module.exports = router;
