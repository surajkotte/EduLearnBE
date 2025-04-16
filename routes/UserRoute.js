const express = require("express");
const UserModal = require("../modals/userModal");
const UserRouter = express.Router();
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const organizationModel = require("../modals/organizationModel");

UserRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    console.log(emailId + " " + password);
    const userData = await UserModal.findOne({
      emailId,
    });
    if (!userData) {
      throw new Error("Invalid Email or Password");
    }
    console.log(userData);
    const isValidPassword = await bcrypt.compare(password, userData?.password);
    if (isValidPassword) {
      const token = JWT.sign({ id: userData?._id }, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      res.cookie("token", token);
      //   res.header("Access-Control-Allow-Origin", "http://localhost:1234");
      //   res.header("Access-Control-Allow-Credentials", true);
      //   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
      //   res.header(
      //     "Access-Control-Allow-Headers",
      //     "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
      //   );
      console.log("sending response");
      res.status(200).json({
        messageType: "S",
        data: {
          firstName: userData?.firstName,
          lastName: userData?.lastName,
          gender: userData?.gender,
          photoURL: userData?.photoURL,
          age: userData?.age,
          skills: userData?.skills,
          education: userData?.education,
          id: userData?._id,
          organizationId: userData?.organizationId,
          userCategory: userData?.userCategory,
        },
      });
    } else {
      throw new Error("Invalid password");
    }
  } catch (err) {
    res.status(400).json({ messageType: "E", message: err.message });
  }
});

UserRouter.post("/signup", async (req, res) => {
  const {
    firstName,
    lastName,
    emailId,
    password,
    age,
    gender,
    photoURL,
    about,
    organization,
    userCategory,
  } = req.body;
  let orgId = null;
  try {
    if (!emailId || !password) {
      throw new Error("Please enter all the details");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const organizationFind = await organizationModel.findOne({
      organizationName: organization,
    });
    if (!organizationFind) {
      const newOrganization = new organizationModel({
        organizationName: organization,
      });
      const orgRes = await newOrganization.save();
      orgId = orgRes?._id;
    } else {
      orgId = organizationFind?._id;
    }
    const User = await UserModal({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      photoURL,
      about,
      organization,
      userCategory,
      organizationId: orgId,
    });
    const response = await User.save();
    if (response) {
      res.status(200).json({ messageType: "S", data: response });
    } else {
      throw new Error("Unable to create user");
    }
  } catch (err) {
    res.status(400).json({ messageType: "E", message: err.message });
  }
});

UserRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", "", { expires: new Date(Date.now() - 1) });
    res.json({ messageType: "S", data: "Logout successful" });
  } catch (err) {
    res.status(400).json({ messageType: "E", message: err.message });
  }
});

UserRouter.get("/checkAuth", async (req, res) => {
  const cookies = req.headers.cookie;
  console.log(cookies);
  try {
    if (cookies) {
      const cookieVal = cookies.split("token=");
      if (cookieVal.length >= 2) {
        const isValidToken = JWT.verify(
          cookieVal[1],
          `${process.env.JWT_SECRET.toString()}`
        );
        if (!isValidToken) {
          throw new Error("Invalid Token");
        }
      } else {
        throw new Error("Invalid Token");
      }
      res.status(200).json({ messageType: "S", data: "Valid" });
    } else {
      throw new Error("Invalid Token");
    }
  } catch (err) {
    res.status(400).json({ messageType: "E", message: err.message });
  }
});

module.exports = UserRouter;
