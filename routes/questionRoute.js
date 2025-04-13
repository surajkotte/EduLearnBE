const express = require("express");
const Question = require("../modals/questionModal");
const questionRouter = express.Router();
const ALLOWED_DATA = "option";

questionRouter.post("/createNew/:categoryId", async (req, res) => {
  const { questionData } = req.body;
  const { categoryId } = req.params;

  try {
    const existingQuestions = await Question.findOne({ categoryId });
    // console.log(existingQuestions);
    if (existingQuestions) {
      const existingQuestionData = existingQuestions.questionData.find(
        (questionInfo) => {
          questionData.some((q) => q.question === questionInfo.question);
        }
      );
      if (existingQuestionData) {
        return res.status(400).json({
          messageType: "E",
          message: "Question with this title already exists",
        });
      } else {
        existingQuestions.questionData.push(...questionData);
        await existingQuestions.save();
        return res
          .status(200)
          .json({ messageType: "S", data: existingQuestions });
      }
    } else {
      console.log(questionData);
      const newQuestion = new Question({
        questionData,
        categoryId,
      });
      await newQuestion.save();
      return res.status(200).json({ messageType: "S", data: newQuestion });
    }
  } catch (error) {
    res.status(400).json({ messageType: "E", message: error.message });
  }
});
questionRouter.get("/getAllQuestions/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  try {
    const questions = await Question.findOne({ categoryId });
    if (!questions) {
      return res.status(200).json({ messageType: "S", data: [] });
    }
    res.status(200).json({ messageType: "S", data: questions });
  } catch (error) {
    res.status(400).json({ messageType: "E", message: error.message });
  }
});
questionRouter.put("/update/:categoryId/:questionId", async (req, res) => {
  const { categoryId, questionId } = req.params;
  const { answerSelected } = req.body;
  try {
    const updatedQuestion = await Question.findOneAndUpdate(
      { categoryId, "questionData._id": questionId },
      { $set: { "questionData.$.answerSelected": answerSelected } },
      { new: true }
    );
    if (!updatedQuestion) {
      return res
        .status(404)
        .json({ messageType: "E", message: "Question not found" });
    }
    res.status(200).json({ messageType: "S", data: updatedQuestion });
  } catch (error) {
    res.status(500).json({ messageType: "E", message: error.message });
  }
});
questionRouter.put("/update/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  const { updatedQuestionData } = req.body;
  try {
    const questionData = await Question.findOne({ categoryId });
    if (!questionData) {
      return res
        .status(404)
        .json({ messageType: "E", message: "Question not found" });
    } else {
      const updatedQuestion = questionData.questionData.map((question) => {
        const updatedQuestionInfo = updatedQuestionData.find(
          (q) => q._id === question._id.toString()
        );
        if (updatedQuestionInfo) {
          question.answerSelected = updatedQuestionInfo.selectedOptionId;
          question.isCorrect =
            updatedQuestionInfo.selectedOptionId ===
            question.options
              .find((option) => option.isAnswer === true)
              ._id.toString();
        }
        return question;
      });
      questionData.questionData = updatedQuestion;
      await questionData.save();
      res.status(200).json({ messageType: "S", data: questionData });
    }
  } catch (error) {
    res.status(500).json({ messageType: "E", message: error.message });
  }
});

questionRouter.post("/deleteQuestion/:questionId", async (req, res) => {
  const { questionId } = req.params;
  const { categoryId } = req.body;
  try {
    console.log(questionId);
    const questions = await Question.findOne({ categoryId });
    if (questions) {
      const updatedQuestionData = questions?.questionData?.filter((q) => {
        return q?._id.toString() != questionId;
      });
      console.log(updatedQuestionData);
      questions["questionData"] = updatedQuestionData;
      const responseData = await questions.save();
      if (responseData) {
        res.status(200).json({ messageType: "S", data: responseData });
      } else {
        res.status(200).json({ messageType: "S", data: [] });
      }
    }
  } catch (err) {
    res.status(500).json({ messageType: "E", message: err.message });
  }
});
questionRouter.post("/deleteAll", async (req, res) => {
  const { categoryId } = req.body;
  try {
    const response = await Question.deleteMany({ categoryId: categoryId });
    if (response) {
      res.status(200).json({ messageType: "S", data: response });
    } else {
      res.status(200).json({ messageType: "S", data: [] });
    }
  } catch (err) {
    res.status(500).json({ messageType: "E", message: err.message });
  }
});

module.exports = questionRouter;
