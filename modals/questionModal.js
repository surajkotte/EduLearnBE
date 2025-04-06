const mongoose = require("mongoose");
const questionSchema = require("../schemas/questionsSchema");
const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
