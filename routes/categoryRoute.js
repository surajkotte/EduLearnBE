const express = require("express");
const Category = require("../modals/categoryModal");
const Question = require("../modals/questionModal");
const categoryRouter = express.Router();

categoryRouter.post("/createNew/:learningModuleId", async (req, res) => {
  const {
    title,
    description,
    image,
    categoryType,
    isTimeLimitAllowed,
    timeLimit,
    retryPossible,
    maxRetryCount,
    allowRetake,
    instructions,
  } = req.body;
  const { learningModuleId } = req.params;

  try {
    const existingCategory = await Category.findOne({ learningModuleId });
    console.log(existingCategory);
    if (existingCategory) {
      const existingCategoryData = existingCategory.categoryData.find(
        (category) =>
          category.title === title && category.categoryType === categoryType
      );
      if (existingCategoryData) {
        return res.status(400).json({
          messageType: "E",
          message: "Category with this title already exists",
        });
      } else {
        existingCategory.categoryData.push({
          title,
          description,
          image,
          categoryType,
          categoryConfig: {
            isTimeLimitAllowed,
            timeLimit,
            retryPossible,
            maxRetryCount,
            allowRetake,
            instructions,
          },
          additionalInfo: {
            numberOfQuestions: 0,
            numberOfQuestionsAnswered: 0,
          },
        });
        await existingCategory.save();
        res.status(200).json({ messageType: "S", data: existingCategory });
      }
    } else {
      const newCategory = new Category({
        categoryData: [
          {
            title,
            description,
            image,
            categoryType,
            categoryConfig: {
              isTimeLimitAllowed,
              timeLimit,
              retryPossible,
              maxRetryCount,
              allowRetake,
              instructions,
            },
            additionalInfo: {
              numberOfQuestions: 0,
              numberOfQuestionsAnswered: 0,
            },
          },
        ],
        learningModuleId,
      });
      await newCategory.save();
      res.status(200).json({ messageType: "S", data: newCategory });
    }
  } catch (error) {
    res.status(500).json({ messageType: "E", message: error.message });
  }
});

categoryRouter.get("/getAllCategories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ messageType: "S", data: categories });
  } catch (error) {
    res.status(400).json({ messageType: "E", message: error.message });
  }
});
categoryRouter.get("/getCategoryById/:learningModuleId", async (req, res) => {
  const { learningModuleId } = req.params;

  try {
    const category = await Category.findOne({ learningModuleId });
    if (!category) {
      return res.status(200).json({ messageType: "S", data: [] });
    }
    res.status(200).json({ messageType: "S", data: category });
  } catch (error) {
    res.status(500).json({ messageType: "E", message: error.message });
  }
});

categoryRouter.get(
  "/getCategoryTestConfig/:learningModuleId/:categoryId",
  async (req, res) => {
    const { learningModuleId, categoryId } = req.params;
    try {
      const category = await Category.findOne({ learningModuleId });
      if (!category) {
        return res.status(200).json({ messageType: "S", data: [] });
      }
      const testConfig = category.categoryData.find(
        (item) => item._id.toString() === categoryId
      );
      if (!testConfig) {
        return res.status(200).json({ messageType: "S", data: [] });
      }
      res.status(200).json({ messageType: "S", data: testConfig?.categoryConfig });
    } catch (err) {
      res.status(500).json({ messageType: "E", message: err.message });
    }
  }
);

categoryRouter.post("/deleteCategory", async (req, res) => {
  const { categoryId, learningModuleId } = req.body;
  try {
    const response = await Question.find({ categoryId });
    if (response && response.length == 0) {
      const catResponse = await Category.findOne({
        learningModuleId: learningModuleId,
      });
      if (catResponse) {
        const newCategory = catResponse?.categoryData?.filter(
          (item) => item?._id.toString() != categoryId
        );
        catResponse["categoryData"] = newCategory;
        const resposeData = await catResponse.save();
        if (resposeData) {
          res.json({ messageType: "S", data: resposeData });
        } else {
          throw new Error("Failed to delete category");
        }
      } else {
        throw new Error("failed to delete category");
      }
    } else {
      throw new Error("Please delete internal questions first");
    }
  } catch (err) {
    res.status(400).json({ messageType: "E", message: err.message });
  }
});

module.exports = categoryRouter;
