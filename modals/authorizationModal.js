const mongoose = require("mongoose");
const authorizationSchema = require("../schemas/authorizationSchema");

const authorizationModal = mongoose.model(
  "authorizationModal",
  authorizationSchema
);

module.exports = authorizationModal;
