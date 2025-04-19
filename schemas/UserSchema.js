const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid EmailId");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Please enter valid Gender");
        }
      },
    },
    photoURL: {
      type: String,
      default:
        "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
      },
    },
    organization: {
      type: String,
      required: true,
    },
    about: {
      type: String,
    },
    userCategory: {
      type: String,
      required: true,
      enum: ["Parent", "Student", "Admin", "Staff"],
    },
    organizationId: {
      type: mongoose.Schema.ObjectId,
      ref: "organizationModel",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = userSchema;
