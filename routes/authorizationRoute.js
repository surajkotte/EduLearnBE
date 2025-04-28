const express = require("express");
const authorizationModal = require("../modals/authorizationModal");
const authorizationRouter = express.Router();
const ALLOWED_DATA = "userId actionAuthorization displayAuthorization";
authorizationRouter.post("/addAutorization", async (req, res) => {
  const { userId, actionRelAuthorization, displayRelAuthorization } = req.body;
  console.log(userId, actionRelAuthorization, displayRelAuthorization);
  try {
    const responseData = await authorizationModal
      .findOne({ userId })
      .populate(ALLOWED_DATA);
    console.log(responseData);
    if (responseData) {
      const actionAuthorizations = responseData.actionAuthorization;
      const displayAuthorizations = responseData.displayAuthorization;
      responseData.actionAuthorization = {
        ...actionAuthorizations,
        ...actionRelAuthorization,
      };
      responseData.displayAuthorization = {
        ...displayAuthorizations,
        ...displayRelAuthorization,
      };
      console.log(responseData);
      const response = await responseData.save();
      res.status(200).json({ messageType: "S", data: response });
    } else {
      const newAuthorizationModal = new authorizationModal({
        userId: userId,
        actionAuthorization: actionRelAuthorization,
        displayAuthorization: displayRelAuthorization,
      });
      const response = await newAuthorizationModal.save();
      res.status(200).json({ messageType: "S", data: response });
    }
  } catch (err) {
    res.status(400).json({ messageType: "E", message: err.message });
  }
});

authorizationRouter.get("/getAutorization/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const responseData = await authorizationModal
      .findOne({ userId })
      .populate(ALLOWED_DATA);
    if (responseData) {
      res.status(200).json({ messageType: "S", data: responseData });
    } else {
      const newAuthorizationModal = new authorizationModal({
        userId: userId,
        actionAuthorization: {},
        displayAuthorization: {},
      });
      const response = await newAuthorizationModal
        .save()
        .populate(ALLOWED_DATA);
      res.status(200).json({ messageType: "S", data: response });
    }
  } catch (err) {
    res.status(400).json({ messageType: "E", message: err.message });
  }
});

module.exports = authorizationRouter;
