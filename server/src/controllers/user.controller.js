const LOGGER = require("../util/logger");
const userService = require("../services/user.service");
const {
  validateNewUserInput,
  validateLoginUserInput,
} = require("../util/validation");

const asyncHandler = require("express-async-handler");

const getAllUsers = async (req, res) => {
  LOGGER.info("getAllUsers: [GET] /api/users");
  try {
    const users = await userService.list();
    return res.status(200).json(users);
  } catch (error) {
    LOGGER.error(error);
    return res.status(500).json(error);
  }
};

const createNewUser = asyncHandler(async (req, res) => {
  LOGGER.info("createNewUser: [POST] /api/users");
  const errors = validateNewUserInput(req.body);
  if (Object.entries(errors).length !== 0) {
    LOGGER.error("Required field missing");
    res.status(400).json(errors);
    throw new Error(errors);
  } else {
    const emailExists = await userService.exists({ email: req.body.email });

    if (!emailExists) {
      const usernameExists = await userService.exists({
        username: req.body.username,
      });

      if (!usernameExists) {
        const user = await userService.save(req.body);

        res.cookie("token", user.token, {
          maxAge: 86400000,
          httpOnly: true,
        });

        res.status(200).json(user);
      } else {
        res.status(400);
        throw new Error("username already exists");
      }
    } else {
      res.status(400);
      throw new Error("email already exists");
    }
  }
});

const getUserByUsername = async (req, res) => {
  LOGGER.info("getUserProfile: [GET] /api/users/:username");

  try {
    LOGGER.info("Getting user from database using the username");
    const user = await userService.indexUsername(req.params.username, false);
    if (user) {
      return res.json(user);
    }
    LOGGER.error("Error occurred finding user in database");
    return res.status(401).json({ error: "Couldn't get user profile" });
  } catch (error) {
    LOGGER.error(error);
    return res.status(500).json({ error: "Couldn't get user profile" });
  }
};
const deleteUser = async (req, res) => {};

const getUserProfile = async (req, res) => {
  LOGGER.info("getUserProfile: [GET] /api/users/profile");

  try {
    LOGGER.info("Getting user from database using the id");
    const user = await userService.index(req.user._id, false);
    if (user) {
      return res.json(user);
    }
    LOGGER.error("Error occurred finding user in database");
    return res.status(401).json({ error: "Couldn't get user profile" });
  } catch (error) {
    LOGGER.error(error);
    return res.status(500).json({ error: "Couldn't get user profile" });
  }
};

const updateUserProfile = asyncHandler(async (req, res) => {
  LOGGER.info("updateUserProfile: [PUT] /api/users/profile");

  console.log(req.body);

  const emailExists = await userService.exists({ email: req.body.email });

  if (!emailExists) {
    const usernameExists = await userService.exists({
      username: req.body.username,
    });

    if (!usernameExists) {
      let updatedUser = {};

      updatedUser.username = req.body.username || req.user.username;
      updatedUser.email = req.body.email || req.user.email;
      updatedUser.location = req.body.userLocation || req.user.location;
      updatedUser.pronouns = req.body.pronouns || req.user.pronouns;
      updatedUser.preferredPronouns =
        req.body.preferredPronouns || req.user.preferredPronouns;
      updatedUser.bio = req.body.bio || req.user.bio;
      updatedUser.facebookProfileUrl =
        req.body.facebookProfileUrl || req.user.facebookProfileUrl;
      updatedUser.instagramProfileUrl =
        req.body.instagramProfileUrl || req.user.instagramProfileUrl;
      updatedUser.twitterProfileUrl =
        req.body.twitterProfileUrl || req.user.twitterProfileUrl;

      const user = await userService.update(req.user.id, updatedUser);
      // const user = await userService.save(req.body);

      res.clearCookie("token");

      res.cookie("token", user.token, {
        maxAge: 86400000,
        httpOnly: true,
      });

      return res.status(200).json(user);
    } else {
      res.status(400);
      throw new Error("username already exists");
    }
  } else {
    res.status(400);
    throw new Error("email already exists");
  }
});

const likeUser = async (req, res) => {};
const dislikeUser = async (req, res) => {};

const authUser = asyncHandler(async (req, res) => {
  LOGGER.info("authUser: [POST] /api/users/login ");

  const errors = validateLoginUserInput(req.body);

  if (Object.entries(errors).length !== 0) {
    LOGGER.error("Required field/fields missing");
    return res.status(400).json(errors);
  }
  const usernameExists = await userService.exists({
    username: req.body.username,
  });

  if (usernameExists) {
    LOGGER.info("User found in DB, logging in");
    const { username, password } = req.body;
    const user = await userService.login(username, password);

    if (user) {
      LOGGER.info("Token generated. User logged in");
      res.cookie("token", user.token, {
        maxAge: 86400000,
        httpOnly: true,
      });
      console.log(res);
      return res.json(user);
    }
    LOGGER.error("Wrong password provided");
    res.status(400);
    throw new Error("username/password is wrong");
  } else {
    LOGGER.error("Username does not exist");
    res.status(400);
    throw new Error("username/password is wrong");
  }
});

const logoutUser = (req, res) => {
  LOGGER.info("authUser: [POST] /api/users/logout ");
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    LOGGER.error(error);
    return res
      .status(500)
      .json({ error: "Some error occurred while logging out" });
  }
};

module.exports = {
  getAllUsers,
  createNewUser,
  getUserByUsername,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  likeUser,
  dislikeUser,
  authUser,
  logoutUser,
};
