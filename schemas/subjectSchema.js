const mongoose = require("mongoose");

const metaDataSchema = mongoose.Schema({
  id: { type: mongoose.Schema.ObjectId, required: true },
  fileName: { type: String },
  mimeType: { type: String },
  fileSize: { type: Number, required: true },
  folderPrefix: { type: String },
});

const subjectMetadataSchema = new mongoose.Schema({
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
  schmea: [metaDataSchema],
});
module.exports = subjectMetadataSchema;
