const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const metaDataSchema = new mongoose.Schema(
  {
    numberOfQuestions: {
      type: Number,
      default: 0,
    },
    numberOfQuestionsAnswered: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const categoryMetaData = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  categoryType: {
    type: String,
    enum: ["Subject", "Topic", "Difficulty", "Test"],
    required: true,
  },
  additionalInfo: metaDataSchema,
  categoryConfig: {
    isTimeLimitAllowed: { type: Boolean, default: false },
    timeLimit: { type: Number, default: 0 },
    retryPossible: { type: Boolean, default: false },
    maxRetryCount: { type: Number, default: 0 },
    allowRetake: { type: Boolean, default: false },
    instructions: { type: String },
  },
});
const categorySchema = new mongoose.Schema(
  {
    categoryData: [categoryMetaData],
    learningModuleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningModule",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = categorySchema;
