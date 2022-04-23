const User = require("../models/user.model");
const generateHashPassword = require("../util/password");
const bcrypt = require("bcrypt");
const generateToken = require("../util/auth");
const { findByIdAndUpdate } = require("../models/user.model");

const list = async () => {
  const users = await User.find(
    { active: true },
    { __v: 0, password: 0 }
  ).exec();
  return users;
};

const exists = async (attribute) => {
  const user = await User.findOne(attribute);
  if (user) return true;
  return false;
};

const index = async (id, includePassword = true) => {
  let user;
  if (includePassword) {
    user = await User.findOne({ _id: id, active: true });
  } else {
    user = await User.findOne({ _id: id, active: true }, { password: 0 });
  }
  if (user) return user;
  return null;
};

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

  console.log(savedUser);
  const token = await generateToken(user._id);

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
    },
  };
};

const login = async (username, password) => {
  const user = await User.findOne({ username, active: true });
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
      },
    };
  }
};

const update = async (id, updatedUser) => {
  const updateUser = await findByIdAndUpdate(id, updatedUser);
  const user = updateUser.exec();

  const token = await generateToken(user._id);
  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
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
};
