const mongoose = require("mongoose");
const organizationSchema = require("../schemas/organizationSchema");
const organizationModel = mongoose.model(
  "organizationModel",
  organizationSchema
);

module.exports = organizationModel;
