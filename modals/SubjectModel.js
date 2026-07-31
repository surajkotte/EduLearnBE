const mongoose = require("mongoose");
const dotenv = require("dotenv");
const subjectSchema = require("../schemas/subjectSchema");
dotenv.config();
const subjectMetadataModel = mongoose.model(
  "subjectMetadataModel",
  subjectSchema,
);

module.exports = subjectMetadataModel;
