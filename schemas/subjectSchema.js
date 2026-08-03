const mongoose = require("mongoose");

const metaDataSchema = mongoose.Schema({
  id: { type: mongoose.Schema.ObjectId, required: true },
  fileName: { type: String },
  mimeType: { type: String },
  fileSize: { type: Number, required: true },
  status: {
    type: String,
    enum: ["uploaded", "processing", "embedded", "failed"],
    default: "uploaded",
  },
  folderPrefix: { type: String },
  uploadedAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
  errorMessage: { type: String },
});

const subjectMetadataSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.ObjectId, required: true },
    learningModuleId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      refs: "LearningModule",
    },
    categoryId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    schema: [metaDataSchema],
  },
  { timestamps: true },
);
module.exports = subjectMetadataSchema;
