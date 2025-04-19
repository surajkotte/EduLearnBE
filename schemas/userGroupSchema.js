const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const usersSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "UserModal",
    },
  },
  { timestamps: true }
);
const userGroupSchema = mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      refs: "organizationModel",
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: { type: String },
    createdUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "UserModal",
    },
    userType: {
      type: String,
      required: true,
      enum: ["Student", "Parent", "Admin", "Staff"],
    },
    users: [usersSchema],
  },
  { timestamps: true }
);

userGroupSchema.index({ organizationId: 1, title: 1 }, { unique: true });

module.exports = userGroupSchema;
