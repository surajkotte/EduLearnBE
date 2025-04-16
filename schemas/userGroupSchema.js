const mongoose = require("mongoose");

const usersSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      refs: "UserModal",
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
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    users: [usersSchema],
  },
  { timestamps: true }
);

module.exports = userGroupSchema;
