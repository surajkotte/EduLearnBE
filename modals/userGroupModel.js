const mongoose = require("mongoose");
const userGroupSchema = require("../schemas/userGroupSchema");

const userGroupModel = mongoose.model("userGroupModel", userGroupSchema);

module.exports = userGroupModel;
