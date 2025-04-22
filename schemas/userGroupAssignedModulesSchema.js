const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const moduleAssignment = mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "LearningModule",
    },
    readAccess: {
      type: Boolean,
      default: true,
    },
    writeAccess: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
const UserGroupAssignedModulesSchema = mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "authorizationModal",
    },
    userGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "userGroupModel",
    },
    modules: [moduleAssignment],
  },
  { timestamps: true }
);

module.exports = UserGroupAssignedModulesSchema;
