const mongoose = require("mongoose");
const express = require("express");
const JWT = require("jsonwebtoken");
const userGroupRouter = express.Router();
const userGroupModel = require("../modals/userGroupModel");
const organizationModel = require("../modals/organizationModel");
const ALLOWED_USERDATA = "firstName lastName emailId";

userGroupRouter.post("/createGroup", async (req, res) => {
  const { title, users, organizationId, description, userType } = req.body;
  try {
    const cookies = req.headers.cookie;
    const token = cookies?.split("token=");
    if (!token || token.length <= 1) {
      throw new Error("Please login");
    }
    const decodedObject = JWT.verify(token[1], process.env.JWT_SECRET);
    const { id } = decodedObject;
    if (organizationId && title && users && users?.length != 0) {
      const organizationData = await organizationModel.findOne({
        _id: organizationId,
      });
      if (!organizationData) {
        throw new Error("OrganizationId invalid");
      }
      const convertedData = users.map((id) => ({
        userId: new mongoose.Types.ObjectId(id),
      }));
      const userGroup = new userGroupModel({
        title,
        organizationId,
        users: convertedData,
        description,
        userType: userType,
        createdUser: id,
      });
      const response1 = await userGroup.save();
      const response = await response1.populate([
        { path: "users.userId", select: ALLOWED_USERDATA },
        { path: "createdUser", select: ALLOWED_USERDATA },
      ]);
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

userGroupRouter.get("/getGroupes/:organizationId", async (req, res) => {
  const { organizationId } = req.params;
  try {
    const responseData = await userGroupModel
      .find({
        organizationId: organizationId,
      })
      .populate("users.userId", ALLOWED_USERDATA)
      .populate("createdUser", ALLOWED_USERDATA);
    if (responseData) {
      res.status(200).json({ messageType: "S", data: responseData });
    } else {
      res.status(200).json({ messageType: "S", data: [] });
    }
  } catch (err) {
    res.status(400).json({ messageType: "E", message: err.message });
  }
});

userGroupRouter.put("/updateGroup/:groupId", async (req, res) => {
  const { title, description, users } = req.body;
  const { groupId } = req.params;
  try {
    const convertedData = users.map((id) => ({
      userId: new mongoose.Types.ObjectId(id),
    }));
    const groupInfo = await userGroupModel.findOne({ _id: groupId });
    if (!groupInfo) {
      throw new Error("GroupId invalid");
    }
    groupInfo.title = title;
    (groupInfo.description = description), (groupInfo.users = convertedData);
    const response = groupInfo.save();
    res.status(200).json({ messageType: "S", data: response });
  } catch (err) {
    res.status(400).json({ messageType: "E", message: err.message });
  }
});
module.exports = userGroupRouter;
