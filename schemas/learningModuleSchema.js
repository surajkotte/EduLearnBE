const mongoose = require("mongoose");

const learningModuleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    status: {
      type: String,
      enum: ["Inprogress", "Completed", "Not Started"],
      default: "Not Started",
      required: true,
    },
    progress: { type: Number, default: 0 },
    logo: { type: String },
    organizationId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      refs: "organizationModel",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = learningModuleSchema;
