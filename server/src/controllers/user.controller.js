const LOGGER = require("../util/logger");
const userService = require("../services/user.service");
const notificationController = require("../controllers/notification.controller");
const {
  validateNewUserInput,
  validateLoginUserInput,
} = require("../util/validation");

const asyncHandler = require("express-async-handler");

// @desc    Get all the users from the database
// @route   GET /api/users
// @access  Private
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

// @desc    Get all the users from the database
// @route   POST /api/users
// @access  Public
const createNewUser = asyncHandler(async (req, res) => {
  LOGGER.info("createNewUser: [POST] /api/users");

  // Validate request inputs
  const errors = validateNewUserInput(req.body);
  if (Object.entries(errors).length !== 0) {
    LOGGER.error("Required field missing");
    res.status(400).json(errors);
    throw new Error(errors);
  } else {
    // Check if email already exists in the database
    const emailExists = await userService.exists({ email: req.body.email });

    if (!emailExists) {
      // Check if username already exists in the database
      const usernameExists = await userService.exists({
        username: req.body.username,
      });

      if (!usernameExists) {
        const user = await userService.save(req.body);

        LOGGER.info("User created, setting cookies and sending response");
        res.cookie("token", user.token, {
          maxAge: 86400000,
          httpOnly: true,
        });

        res.status(200).json(user);
      } else {
        res.status(400);
        LOGGER.error("Username already exists, throwing error");
        throw new Error("username already exists");
      }
    } else {
      res.status(400);
      LOGGER.error("Email already exists, throwing error");
      throw new Error("email already exists");
    }
  }
});

// @desc    Get user by username
// @route   GET /api/users/:username
// @access  Private
const getUserByUsername = async (req, res) => {
  LOGGER.info("getUserProfile: [GET] /api/users/:username");

  try {
    LOGGER.info("Getting user from database using the username");
    const user = await userService.indexUsername(req.params.username, false);
    if (user) {
      LOGGER.info("User found, sending in the response");
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

// @desc    Get user profile for the authorized user
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  LOGGER.info("getUserProfile: [GET] /api/users/profile");

  try {
    LOGGER.info("Getting user from database using the id");
    const user = await userService.index(req.user._id, false);
    if (user) {
      LOGGER.info("User profile fetched, sending in the response");
      return res.json(user);
    }
    LOGGER.error("Error occurred finding user in database");
    return res.status(401).json({ error: "Couldn't get user profile" });
  } catch (error) {
    LOGGER.error(error);
    return res.status(500).json({ error: "Couldn't get user profile" });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  LOGGER.info("updateUserProfile: [PUT] /api/users/profile");

  let updatedUser = {};

  updatedUser.username = req.body.username || req.user.username;
  updatedUser.email = req.body.email || req.user.email;
  updatedUser.location = req.body.location || req.user.location;
  updatedUser.pronouns = req.body.pronouns || req.user.pronouns;
  updatedUser.preferredPronouns =
    req.body.preferredPronouns || req.user.preferredPronouns;
  updatedUser.ageGroup = req.body.ageGroup || req.user.ageGroup;
  updatedUser.preferredAgeGroup =
    req.body.preferredAgeGroup || req.user.preferredAgeGroup;
  updatedUser.bio = req.body.bio || req.user.bio;
  updatedUser.facebookProfileUrl =
    req.body.facebookProfileUrl || req.user.facebookProfileUrl;
  updatedUser.instagramProfileUrl =
    req.body.instagramProfileUrl || req.user.instagramProfileUrl;
  updatedUser.twitterProfileUrl =
    req.body.twitterProfileUrl || req.user.twitterProfileUrl;
  updatedUser.q1 = req.body.q1 || req.user.q1;
  updatedUser.q2 = req.body.q2 || req.user.q2;
  updatedUser.q3 = req.body.q3 || req.user.q3;
  updatedUser.q4 = req.body.q4 || req.user.q4;
  updatedUser.q5 = req.body.q5 || req.user.q5;

  const user = await userService.update(req.user.id, updatedUser);
  LOGGER.info("User profile updated, updating cookies and sending in the user");

  res.clearCookie("token");

  res.cookie("token", user.token, {
    maxAge: 86400000,
    httpOnly: true,
  });

  return res.status(200).json(user);
});

// @desc    Get likes for the authorized user
// @route   GET /api/users/likes
// @access  Private
const getLikes = asyncHandler(async (req, res) => {
  LOGGER.info("getMatches: [GET] api/user/likes");

  try {
    const likes = await userService.indexLikes(req.user.likes);
    LOGGER.info("Likes fetched, sending in the response");
    return res.status(200).json(likes);
  } catch (error) {
    res.status(500);
    LOGGER.error(error);
    throw new Error("Error occurred getting likes");
  }
});

// @desc    Like a user provided in the database
// @route   PUT /api/users/like
// @access  Private
const likeUser = asyncHandler(async (req, res) => {
  LOGGER.info("likeUser: [PUT] api/user/like");

  try {
    const userLiking = req.user;
    const userLiked = req.body.user;

    let user = await userService.like(userLiking, userLiked);

    if (user) {
      LOGGER.info("Liked a user, sending notifications");

      const notification = await notificationController.createNotification(
        userLiking._id,
        userLiked._id,
        "like"
      );

      LOGGER.info(
        "Notification sent, resetting cookies and sending in response"
      );
      res.clearCookie("token");

      res.cookie("token", user.token, {
        maxAge: 86400000,
        httpOnly: true,
      });

      res.status(201).json(user);
    }
  } catch (error) {
    LOGGER.error(error);
    res.status(500);
    throw new Error("Error occurred while liking the user");
  }
});

// @desc    Get matches for the authorized user
// @route   GET /api/users/matches
// @access  Private
const getMatches = asyncHandler(async (req, res) => {
  LOGGER.info("getMatches: [GET] api/user/matches");

  try {
    const matches = await userService.indexMatch(req.user.matches);
    LOGGER.info("Matches fetched, sending in users");
    return res.status(200).json(matches);
  } catch (error) {
    res.status(500);
    LOGGER.error(error);
    throw new Error("Error occurred getting matches");
  }
});

// @desc    Add user provided to matches for authorized user
// @route   PUT /api/users/match
// @access  Private
const matchUser = asyncHandler(async (req, res) => {
  LOGGER.info("matchUser: [PUT] api/user/match");

  const userMatching = req.user;
  const userMatched = req.body.user;

  let user = await userService.match(userMatching, userMatched);

  if (user) {
    LOGGER.info("Added to match, sending notification");
    const notification = await notificationController.createNotification(
      userMatching._id,
      userMatched._id,
      "match"
    );

    LOGGER.info("Notification sent, resetting cookies and sending in response");
    res.clearCookie("token");

    res.cookie("token", user.token, {
      maxAge: 86400000,
      httpOnly: true,
    });

    res.status(201).json(user);
  } else {
    res.status(500);
    throw new Error("Error occurred while matching the user");
  }
});

// @desc    Dislike user provided in the request for authorized user
// @route   PUT /api/users/dislike
// @access  Private
const dislikeUser = asyncHandler(async (req, res) => {
  LOGGER.info("dislikeUser: [PUT] api/user/dislike");

  const userDisliking = req.user;
  const userDisliked = req.body.user;

  let user = await userService.dislike(userDisliking, userDisliked);

  if (user) {
    LOGGER.info("Disliked user, sending notification");
    console.log(user);

    const notification = await notificationController.deleteNotification(
      userLiking._id,
      userLiked._id,
      "like"
    );

    LOGGER.info("Notification sent, resetting cookies and sending in response");

    res.clearCookie("token");

    res.cookie("token", user.token, {
      maxAge: 86400000,
      httpOnly: true,
    });

    res.status(201).json(user);
  } else {
    res.status(500);
    throw new Error("Error occurred while disliking the user");
  }
});

// @desc    Dismatch a user from the authorized user
// @route   PUT /api/users/dismatch
// @access  Private
const dismatchUser = asyncHandler(async (req, res) => {
  LOGGER.info("dismatchUser: [PUT] api/user/dismatch");

  const userDisliking = req.user;
  const userDisliked = req.body.user;

  let user = await userService.dislike(userDisliking, userDisliked);

  if (user) {
    LOGGER.info("Dismatched user, resetting cookies and sending in response");
    res.clearCookie("token");

    res.cookie("token", user.token, {
      maxAge: 86400000,
      httpOnly: true,
    });

    res.status(201).json(user);
  } else {
    res.status(500);
    throw new Error("Error occurred while disliking the user");
  }
});

// @desc    Authorizing user
// @route   POST /api/users/login
// @access  Private
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

// @desc    Logging out user
// @route   POST /api/users/logout
// @access  Private
const logoutUser = (req, res) => {
  LOGGER.info("logoutUser: [POST] /api/users/logout ");
  try {
    res.clearCookie("token");
    LOGGER.info("User logged out, successfully");
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
  getLikes,
  likeUser,
  dislikeUser,
  getMatches,
  matchUser,
  dismatchUser,
  authUser,
  logoutUser,
};
