const express = require("express");
const userController = require("../controllers/user.controller");
const { authorize } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router
  .get("/", authorize, userController.getAllUsers)
  .post("/", userController.createNewUser)
  .get("/profile", authorize, userController.getUserProfile)
  .put("/profile", authorize, userController.updateUserProfile)
  .post("/login", userController.authUser)
  .get("/logout", userController.logoutUser)
  .get("/likes", authorize, userController.getLikes)
  .put("/like", authorize, userController.likeUser)
  .put("/dislike", authorize, userController.dislikeUser)
  .get("/matches", authorize, userController.getMatches)
  .put("/match", authorize, userController.matchUser)
  .put("/dismatch", authorize, userController.dismatchUser)
  .get("/:username", authorize, userController.getUserByUsername)
  .delete("/:username", authorize, userController.deleteUser);

module.exports = router;
