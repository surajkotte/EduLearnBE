const mongoose = require("mongoose");
const actionAuthSchema = mongoose.Schema(
  {
    deleteCategory: {
      type: Boolean,
      default: true,
      required: true,
    },
    deleteQuestion: {
      type: Boolean,
      default: true,
      required: true,
    },
    deleteQuestions: {
      type: Boolean,
      default: true,
      required: true,
    },
    deleteLearningModule: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true }
);
const displayAuthSchema = mongoose.Schema({
  displayLearningModule: {
    type: Boolean,
    default: true,
    required: true,
  },
  displayCategory: {
    type: Boolean,
    default: true,
    required: true,
  },
  displayQuestions: {
    type: Boolean,
    default: true,
    required: true,
  },
});
const authorizationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "UserModal",
      required: true,
    },
    actionAuthorization: actionAuthSchema,
    displayAuthorization: displayAuthSchema,
  },
  { timestamps: true }
);

module.exports = authorizationSchema;
