const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    phone: {
      type: String
    },

    profilePicture: {
      type: String,
      default: ""
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    description: {
      type: String,
      default: ""
    },

    occupation: {
      type: String,
      lowercase: true,
      trim: true // cook, decorator, coordinator
    },

    experience: {
      type: String,
      default: ""
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
