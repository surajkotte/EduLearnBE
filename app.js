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
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
const PORT = process.env.PORT;
app.use("/", userRouter);
app.use("/learning/", learningModuleRouter);
app.use("/category/", categoryRouter);
app.use("/questions/", questionRouter);
app.use("/authorization/", authorizationRouter);
app.use("/userroute/", userGroupRouter);
app.use("/answers/", answerRouter);
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
