const mongoose = require("mongoose");

const organizationSchema = mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: true,
      unique: true,
      required: true,
    },
    organizationLogo: { type: String, default: "" },
    organizationImage: { type: String, default: "" },
    organizationAddress: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = organizationSchema;
