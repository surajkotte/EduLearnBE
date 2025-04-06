const mongoose = require("mongoose");

const learningModuleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    status: {
      type: String,
      enum: ["Inprogress", "Completed", "Not Started"],
      default: "Not Started",
      required: true,
    },
    progress: { type: Number, default: 0, required: true },
    logo: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = learningModuleSchema;
