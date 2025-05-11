const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectDB } = require("./config/dbconnection");
app.use(
  cors({
    origin: "http://localhost:1234",
    credentials: true,
  })
);
app.use(bodyParser.json());
const categoryRouter = require("./routes/categoryRoute");
const learningModuleRouter = require("./routes/larningModuleRoute");
const questionRouter = require("./routes/questionRoute");
const userRouter = require("./routes/UserRoute");
const authorizationRouter = require("./routes/authorizationRoute");
const userGroupRouter = require("./routes/userGroupRoute");
const answerRouter = require("./routes/AnswersRoute");
const userAuth = require("./middlewares/auth");
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
const PORT = process.env.PORT;
app.use("/", userRouter);
app.use("/learning/", userAuth, learningModuleRouter);
app.use("/category/", userAuth, categoryRouter);
app.use("/questions/", userAuth, questionRouter);
app.use("/authorization/", userAuth, authorizationRouter);
app.use("/userroute/", userAuth, userGroupRouter);
app.use("/answers/", userAuth, answerRouter);
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
