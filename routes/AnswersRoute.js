const express = require("express");
const AnswerModel = require("../modals/AnswerModel");
const Question = require("../modals/questionModal");
const answerRouter = express.Router();

answerRouter.post("/updateanswer/:categoryId", async (req, res) => {
  const { userId, answerData } = req.body;
  const { categoryId } = req.params;
  if (!userId || !categoryId) {
    throw new Error("userId and categoryId are required");
  }
  try {
    const questions = await Question.findOne({ categoryId });
    const response = await AnswerModel.find({ userId, categoryId });
    if (response && response.length > 0) {
      const updatedAnswer = await AnswerModel.findOneAndUpdate(
        { userId, categoryId },
        { answerSelected: answerData },
        { new: true }
      );
      if (updatedAnswer) {
        console.log(questions.questionData[0].options);
        const modifiedAnswerData = updatedAnswer.answerSelected.map(
          (answer) => {
            const question = questions?.questionData.find(
              (question) =>
                question?._id?.toString() === answer?.questionId?.toString()
            );
            if (question) {
              return {
                ...answer.toObject(),
                isCorrect: question.options.find(
                  (option) =>
                    option?._id?.toString() === answer?.answerId?.toString()
                )?.isAnswer,
              };
            }
          }
        );
        //updatedAnswer.answerSelected = modifiedAnswerData;
        res.status(200).json({
          messageType: "S",
          data: modifiedAnswerData,
        });
        return;
      }
      res.status(200).json({ messageType: "S", data: updatedAnswer });
    } else {
      const newAnswer = new AnswerModel({
        userId,
        categoryId,
        answerSelected: answerData,
      });
      const response = await newAnswer.save();
      const modifiedAnswerData = response.answerSelected.map((answer) => {
        const question = questions.questionData.find(
          (question) =>
            question?._id.toString() === answer?.questionId.toString()
        );
        if (question) {
          return {
            ...answer.toObject(),
            isCorrect: question.options.find(
              (option) =>
                option?._id?.toString() === answer.answerId?.toString()
            ).isAnswer,
          };
        }
      });
      res.status(200).json({ messageType: "S", data: modifiedAnswerData });
    }
  } catch (err) {
    res.status(400).json({ messageType: "E", message: err.message });
  }
});

answerRouter.get("/getAnswers/:categoryId/:userId", async (req, res) => {
  const { categoryId, userId } = req.params;
  try {
    if (!userId || !categoryId) {
      throw new Error("userId and categoryId are required");
    }
    const questions = await Question.find({ categoryId });
    console.log("questions", questions[0].questionData);
    if (!questions) {
      res.status(200).json({ messageType: "S", data: [] });
      return;
    }
    const response = await AnswerModel.find({
      userId,
      categoryId,
    });

    if (response && response.length > 0) {
      const modifiedAnswer = response[0]?.answerSelected?.map((ans) => {
        const question = questions[0].questionData.find(
          (question) => question._id.toString() === ans.questionId.toString()
        );
        if (question) {
          return {
            ...ans.toObject(),
            isCorrect: question.options.find(
              (option) => option?._id?.toString() === ans?.answerId?.toString()
            )?.isAnswer,
          };
        }
      });
      // const newResponse = response[0];
      //newResponse.answerSelected = modifiedAnswer;
      // console.log(modifiedAnswer);
      // console.log("Modified answers");
      // console.log(modifiedAnswer);
      // console.log("Selected Answers");
      // console.log(newResponse.answerSelected);
      res.status(200).json({ messageType: "S", data: modifiedAnswer });
      return;
    }
    res.status(200).json({ messageType: "S", data: [] });
  } catch (err) {
    res.status(400).json({ messageType: "E", message: err.message });
    return;
  }
});

module.exports = answerRouter;
