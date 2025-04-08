const express = require("express");
const Category = require("../modals/categoryModal");
const categoryRouter = express.Router();

categoryRouter.post("/createNew/:learningModuleId", async (req, res) => {
  const { title, description, image, categoryType } = req.body;
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
  "/getCategoryTestConfig/:learningModuleId",
  async (req, res) => {
    try {
      const category = await Category.findOne({ learningModuleId });
      if (!category) {
        return res.status(200).json({ messageType: "S", data: [] });
      }
      res.status(200).json({ messageType: "S", data: category?.testConfig });
    } catch (err) {
      res.status(500).json({ messageType: "E", message: err.message });
    }
  }
);

module.exports = categoryRouter;
