const mongoose = require("mongoose");

const selectedAnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  answerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Option",
    default: null,
  },
});
const AnswerSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    answerSelected: [selectedAnswerSchema],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = AnswerSchema;
