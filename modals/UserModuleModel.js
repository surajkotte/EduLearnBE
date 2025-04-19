const mongoose = require("mongoose");
const UserModuleSchema = require("../schemas/UserModuleSchema");
const UserModuleModel = mongoose.model("UserModuleModel", UserModuleSchema);

module.exports = UserModuleModel;
