const mongoose = require("mongoose");
const UserSchema = require("../schemas/UserSchema");

const UserModal = mongoose.model("UserModal", UserSchema);

module.exports = UserModal;
