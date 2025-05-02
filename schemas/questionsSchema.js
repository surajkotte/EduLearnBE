const mongoose = require("mongoose");
const mcqSchame = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [
      {
        option: { type: String, required: true },
        isAnswer: { type: Boolean, default: false },
      },
    ],
    // answerSelected: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Option",
    //   default: null,
    // },
    // isCorrect: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const questionSchema = new mongoose.Schema(
  {
    questionData: [mcqSchame],
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    selectAll: { type: Boolean, default: false },
    retryPossible: { type: Boolean, default: false },
    maxRetryCount: { type: Number, default: 0 },
    timeTaken: { type: Number, default: 0 },
    isTimeLimitAllowed: { type: Boolean, default: false },
    timeLimit: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);
module.exports = questionSchema;
