const JWT = require("jsonwebtoken");
const User = require("../modals/userModal");
const userAuth = async (req, res, next) => {
  console.log(req);
  const cookies = req.headers.cookie;
  console.log(cookies);
  try {
    const token = cookies?.split("token=");
    if (!token || token.length <= 1) {
      throw new Error("Please login");
    }
    const decodedObject = await JWT.verify(token[1], process.env.JWT_SECRET);
    if (decodedObject) {
      const { id } = decodedObject;
      // console.log(decodedObject);
      const userData = await User.findById(id);
      if (!userData) {
        throw new Error("User not found");
      }
      req.user = userData;
      res.header("Access-Control-Allow-Origin", "http://localhost:1234");
      res.header("Access-Control-Allow-Credentials", true);
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
      );
      next();
    } else {
      throw new Error("Unable to parse token");
    }
  } catch (err) {
    res.status(401).json({ messageType: "E", message: err.message });
  }
};
module.exports = userAuth;
