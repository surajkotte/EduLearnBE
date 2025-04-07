const mongoose = require("mongoose");
const categoryMetaData = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  categoryType: {
    type: String,
    enum: ["Subject", "Topic", "Difficulty", "Test"],
    required: true,
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
    testConfig: {
      isTimeLimitAllowed: { type: Boolean, default: false },
      timeLimit: { type: Number, default: 0 }, // in seconds or minutes
      retryPossible: { type: Boolean, default: false },
      maxRetryCount: { type: Number, default: 0 },
      allowRetake: { type: Boolean, default: false },
      instructions: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = categorySchema;
