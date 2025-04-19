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
const UserModuleSchema = mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "UserModal" },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "authorizationModal",
    },
    modules: [moduleAssignment],
  },
  { timestamps: true }
);

module.exports = UserModuleSchema;
