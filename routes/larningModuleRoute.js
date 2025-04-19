const express = require("express");
const learningModuleRouter = express.Router();
const LearningModule = require("../modals/learningModuleModal");
const organizationModel = require("../modals/organizationModel");
const UserModuleModel = require("../modals/UserModuleModel");
const userGroupModel = require("../modals/userGroupModel");
const userAuth = require("../middlewares/auth");
learningModuleRouter.get(
  "/getAll/:organizationId",
  userAuth,
  async (req, res) => {
    const { organizationId } = req.params;
    try {
      console.log(organizationId);
      const learningModules = await LearningModule.find({
        organizationId: organizationId,
      });
      res.status(200).json({ messageType: "S", data: learningModules });
    } catch (error) {
      res.status(400).json({ messageType: "E", message: error.message });
    }
  }
);
learningModuleRouter.post("/createNew", async (req, res) => {
  const { name, description, image, logo, status, progress, organizationId } =
    req.body;
  const organizationInfo = await organizationModel.findOne({
    _id: organizationId,
  });
  try {
    const newLearningModule = new LearningModule({
      name,
      description,
      image,
      status,
      progress,
      logo: organizationInfo?.organizationLogo,
      organizationId,
    });
    const responseData = await newLearningModule.save();
    if (responseData) {
      return res.status(200).json({ messageType: "S", data: responseData });
    } else {
      return res.status(400).json({
        messageType: "E",
        message: "Failed to create learning module",
      });
    }
  } catch (error) {
    res.status(400).json({ messageType: "E", message: error.message });
  }
});
learningModuleRouter.get("/getById/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const learningModule = await LearningModule.findById(id);
    if (!learningModule) {
      return res.status(200).json({ messageType: "S", data: [] });
    }
    res.status(200).json({ messageType: "S", data: learningModule });
  } catch (error) {
    res.status(500).json({ messageType: "E", message: error.message });
  }
});

learningModuleRouter.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, image, logo, status, progress } = req.body;

  try {
    const updatedLearningModule = await LearningModule.findByIdAndUpdate(
      id,
      {
        name: title,
        description,
        image,
        logo,
        status,
        progress,
      },
      { new: true }
    );
    if (!updatedLearningModule) {
      return res.status(404).json({ messageType: "E", message: "Not Found" });
    }
    res.status(200).json({ messageType: "S", data: updatedLearningModule });
  } catch (error) {
    res.status(500).json({ messageType: "E", message: error.message });
  }
});
learningModuleRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedLearningModule = await LearningModule.findByIdAndDelete(id);
    if (!deletedLearningModule) {
      return res.status(404).json({ messageType: "E", message: "Not Found" });
    }
    res.status(200).json({ messageType: "S", data: deletedLearningModule });
  } catch (error) {
    res.status(500).json({ messageType: "E", message: error.message });
  }
});

learningModuleRouter.post(
  "/assignModules/:organizationId",
  async (req, res) => {
    const { learningModules, GroupId } = req.body;
    const { organizationId } = req.params;
    const assignmentResults = [];
    try {
      const findUserGroup = await userGroupModel.findOne({ _id: GroupId });
      if (findUserGroup) {
        const users = findUserGroup?.users;
        users?.forEach(async (user) => {
          const response = await UserModuleModel.find({
            userId: user?.userId,
            organizationId: organizationId,
          });
          console.log(response);
          if (response && response?.length != 0) {
            const moduleMap = new Map();
            response.modules?.forEach((mod) => {
              moduleMap.set(mod.moduleId.toString(), mod);
            });
            for (const newModule of learningModules) {
              const existingModule = moduleMap.get(
                newModule.moduleId.toString()
              );
              if (existingModule) {
                existingModule.readAccess = newModule.readAccess;
                existingModule.writeAccess = newModule.writeAccess;
              } else {
                response?.modules?.push(newModule);
              }
            }
            const res1 = await response.save();
            assignmentResults.push(res1);
          } else {
            const newUserModule = new UserModuleModel({
              userId: user?.userId,
              organizationId: organizationId,
              modules: learningModules,
            });
            const response = await newUserModule.save();
            assignmentResults.push(response);
          }
        });
        res.status(200).json({ messageType: "S", data: assignmentResults });
      } else {
        throw new Error("GroupId not found");
      }
    } catch (err) {
      res.status(400).json({ messageType: "E", message: err.message });
    }
  }
);
module.exports = learningModuleRouter;
