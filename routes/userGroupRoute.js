const express = require("express");
const userGroupRouter = express.Router();
const userGroupModel = require("../modals/userGroupModel");
const organizationModel = require("../modals/organizationModel");

userGroupRouter.post("/createGroup", async (req, res) => {
  const { title, users, organizationId } = req.body;
  try {
    if (organizationId && title && users && users?.length != 0) {
      const organizationData = await organizationModel.findOne({
        _id: organizationId,
      });
      if (!organizationData) {
        throw new Error("OrganizationId invalid");
      }
      const userGroup = new userGroupModel({
        title,
        organizationId,
        users,
      });
      const response = await userGroup.save();
      if (response) {
        res.status(200).json({ messageType: "S", data: response });
      } else {
        throw new Error("Unable to save usergroup data");
      }
    } else {
      throw new Error("Please provide all details");
    }
  } catch (err) {
    res.status(400).json({ messageType: "E", message: err.message });
  }
});

module.exports = userGroupRouter;
