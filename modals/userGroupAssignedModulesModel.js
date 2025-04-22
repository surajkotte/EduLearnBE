const mongoose = require("mongoose");
const userGroupAssignedModulesSchema = require("../schemas/userGroupAssignedModulesSchema");

const userGroupAssignedModulesModel = mongoose.model(
  "userGroupAssignedModulesModel",
  userGroupAssignedModulesSchema
);
module.exports = userGroupAssignedModulesModel;
