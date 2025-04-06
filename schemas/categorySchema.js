const mongoose = require("mongoose");
const categoryMetaData = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  categoryType: {
    type: String,
    enum: ["Subject", "Topic", "Difficulty"],
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
  },
  {
    timestamps: true,
  }
);

module.exports = categorySchema;
