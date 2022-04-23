const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Name is  required",
  },
  username: {
    type: String,
    required: "Username is required",
    unique: "Username already exists",
  },
  email: {
    type: String,
    unique: "Email already exists",
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
    required: "Email is required",
  },
  password: {
    type: String,
    required: "Password is required",
  },
  bio: {
    type: String,
    trim: true,
    default: "",
  },
  pronouns: {
    type: String,
    enum: ["he/him", "she/her", "they/them"],
    required: true,
  },
  preferredPronouns: {
    type: String,
    enum: ["he/him", "she/her", "they/them"],
    required: true,
  },
  location: {
    type: { type: String },
    coordinates: [Number],
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  matches: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  pictures: [
    {
      type: String,
    },
  ],
  facebookProfileUrl: {
    type: String,
    default: "",
  },
  instagramProfileUrl: {
    type: String,
    default: "",
  },
  twitterProfileUrl: {
    type: String,
    default: "",
  },
  ageGroup: {
    type: String,
    enum: ["18-21", "22-25", "25-29", "30+"],
  },
  preferredAgeGroup: {
    type: String,
    enum: ["18-21", "22-25", "25-29", "30+"],
  },
  active: {
    type: Boolean,
    default: true,
  },
});

UserSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", UserSchema);
