const mongoose = require("mongoose");
const AnswerSchema = require("../schemas/AnswersSchema");
const AnswerModel = mongoose.model("AnswerModel", AnswerSchema);

module.exports = AnswerModel;
