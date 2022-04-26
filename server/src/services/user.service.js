const User = require("../models/user.model");
const generateHashPassword = require("../util/password");
const bcrypt = require("bcrypt");
const generateToken = require("../util/auth");
const LOGGER = require("../util/logger");

// Fetching all the active users from the database and returning required fields excluding data private to the users
const list = async () => {
  const users = await User.find(
    { active: true },
    {
      __v: 0,
      password: 0,
      preferredPronouns: 0,
      requests: 0,
      likes: 0,
      matches: 0,
    }
  ).exec();
  return users;
};

// Check if the user exists in the database using the attribute provided
const exists = async (attribute) => {
  const user = await User.findOne(attribute);
  if (user) return true;
  return false;
};

// Get a specific user from the database using the id provided
const index = async (id, includePassword = true) => {
  let user;
  if (includePassword) {
    user = await User.findOne({ _id: id, active: true })
      .populate(
        "requests",
        "-requests -matches -likes -__v -preferredAgeGroup -preferredPronouns"
      )
      .populate(
        "matches",
        "-requests -matches -likes -__v -preferredAgeGroup -preferredPronouns"
      )
      .populate(
        "likes",
        "-requests -matches -likes -__v -preferredAgeGroup -preferredPronouns"
      );
  } else {
    user = await User.findOne({ _id: id, active: true }, { password: 0 })
      .populate(
        "requests",
        "-requests -matches -likes -__v -preferredAgeGroup -preferredPronouns"
      )
      .populate(
        "matches",
        "-requests -matches -likes -__v -preferredAgeGroup -preferredPronouns"
      )
      .populate(
        "likes",
        "-requests -matches -likes -__v -preferredAgeGroup -preferredPronouns"
      );
  }
  if (user) return user;
  return null;
};

// Get matches for the user form the database
const indexMatch = async (userMatches) => {
  let matches = await User.find(
    { _id: { $in: userMatches } },
    { password: 0, preferredPronouns: 0, likes: 0, matches: 0, requests: 0 }
  );

  if (matches) return matches;
  return null;
};

// Get likes for the user from the database
const indexLikes = async (userLikes) => {
  let likes = await User.find(
    { _id: { $in: userLikes } },
    { password: 0, preferredPronouns: 0, likes: 0, matches: 0, requests: 0 }
  );

  if (likes) return likes;
  return null;
};

// Get user from the database using the username provided
const indexUsername = async (username, includePassword = true) => {
  let user;
  if (includePassword) {
    user = await User.findOne({ username: username, active: true });
  } else {
    user = await User.findOne(
      { username: username, active: true },
      { password: 0 }
    );
  }
  if (user) return user;
  return null;
};

// Add a new user to the database with details provided in the payload
const save = async (payload) => {
  const {
    name,
    username,
    email,
    password,
    pronouns,
    preferredPronouns,
    location,
  } = payload;

  // Hash the password to store in the database
  const hashPassword = await generateHashPassword(password);
  const user = new User({
    name,
    username,
    password: hashPassword,
    email,
    location,
    preferredPronouns,
    pronouns,
  });

  const savedUser = await user.save();

  // Generate JWT token to send the in the response for user authentication in future
  const token = await generateToken(user._id);

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      likes: user.likes,
      matches: user.matches,
    },
  };
};

// Authorize the user and return the user object with necessary fields
const login = async (username, password) => {
  const user = await User.findOne({ username, active: true })
    .populate(
      "requests",
      "-requests -matches -likes -__v -preferredAgeGroup -preferredPronouns"
    )
    .populate(
      "matches",
      "-requests -matches -likes -__v -preferredAgeGroup -preferredPronouns"
    )
    .populate(
      "likes",
      "-requests -matches -likes -__v -preferredAgeGroup -preferredPronouns"
    );
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return null;
  } else {
    const token = await generateToken(user._id);
    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        likes: user.likes,
        matches: user.matches,
      },
    };
  }
};

// Update the user identified by the id provided and the fields to update provided as updatedUser
const update = async (id, updatedUser) => {
  const newUser = await User.findByIdAndUpdate(id, updatedUser, {
    new: true,
  })
    .populate("requests", "-requests -matches -likes")
    .populate("matches", "-requests -matches -likes")
    .populate("likes", "-requests -matches -likes");
  console.log(newUser);

  const token = await generateToken(newUser._id);
  return {
    token,
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
      likes: newUser.likes,
      matches: newUser.matches,
    },
  };
};

// Like a user
const like = async (userLiking, userLiked) => {
  LOGGER.info("Inside like service");

  // Add the user being liked to likes of the user initiating the like
  const user = await User.findByIdAndUpdate(
    userLiking._id,
    {
      $addToSet: { likes: userLiked._id },
    },
    { new: true }
  )
    .populate(
      "requests",
      "-requests -matches -likes -__v -preferredAgeGroup -preferredPronouns"
    )
    .populate(
      "matches",
      "-requests -matches -likes -__v -preferredAgeGroup -preferredPronouns"
    )
    .populate(
      "likes",
      "-requests -matches -likes -__v -preferredAgeGroup -preferredPronouns"
    );

  // Add the user initiating the like to requests of the user being liked
  const userGettingLiked = await User.findByIdAndUpdate(
    userLiked._id,
    {
      $addToSet: { requests: userLiking._id },
    },
    { new: true }
  );

  const token = await generateToken(user._id);
  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      likes: user.likes,
      matches: user.matches,
    },
  };
};

// Add users as a match
const match = async (userMatching, userMatched) => {
  console.log(userMatched);

  // Check to see if the user initiating the match function is in the requests of the user being matched
  const matchingUser = await User.count({
    _id: userMatching.id,
    requests: { $in: [userMatched._id] },
  });

  if (matchingUser) {
    let user = await User.findByIdAndUpdate(
      userMatching._id,
      {
        $pull: { requests: userMatched._id },
      },
      { new: true }
    )
      .populate(
        "requests",
        "-requests -matches -likes -__v -preferredAgeGroup -preferredPronouns"
      )
      .populate(
        "matches",
        "-requests -matches -likes -__v -preferredAgeGroup -preferredPronouns"
      )
      .populate(
        "likes",
        "-requests -matches -likes -__v -preferredAgeGroup -preferredPronouns"
      );

    user = await User.findByIdAndUpdate(
      userMatching._id,
      {
        $addToSet: { matches: userMatched._id },
      },
      { new: true }
    )
      .populate(
        "requests",
        "-requests -matches -likes -__v -preferredAgeGroup -preferredPronouns"
      )
      .populate(
        "matches",
        "-requests -matches -likes -__v -preferredAgeGroup -preferredPronouns"
      )
      .populate(
        "likes",
        "-requests -matches -likes -__v -preferredAgeGroup -preferredPronouns"
      );

    let userGettingMatched = await User.findByIdAndUpdate(
      userMatched._id,
      {
        $pull: { likes: userMatching._id },
      },
      { new: true }
    );

    userGettingMatched = await User.findByIdAndUpdate(
      userMatched._id,
      {
        $addToSet: { matches: userMatching._id },
      },
      { new: true }
    );

    const token = await generateToken(user._id);
    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        likes: user.likes,
        matches: user.matches,
      },
    };
  } else {
    throw new Error("Cannot match with user");
  }
};

// Dislike a user
const dislike = async (userDisliking, userDisliked) => {
  const user = await User.findByIdAndUpdate(
    userDisliking._id,
    {
      $pull: { likes: userDisliked._id },
    },
    { new: true }
  )
    .populate(
      "requests",
      "-requests -matches -likes -__v -preferredAgeGroup -preferredPronouns"
    )
    .populate(
      "matches",
      "-requests -matches -likes -__v -preferredAgeGroup -preferredPronouns"
    )
    .populate(
      "likes",
      "-requests -matches -likes -__v -preferredAgeGroup -preferredPronouns"
    );

  const userGettingDisliked = await User.findByIdAndUpdate(
    userDisliked._id,
    {
      $pull: { requests: userDisliking._id },
    },
    { new: true }
  );

  const token = await generateToken(user._id);
  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      likes: user.likes,
      matches: user.matches,
    },
  };
};

module.exports = {
  list,
  exists,
  save,
  login,
  index,
  indexUsername,
  update,
  like,
  dislike,
  match,
  indexMatch,
  indexLikes,
};
