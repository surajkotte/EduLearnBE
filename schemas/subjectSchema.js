const mongoose = require("mongoose");

const metaDataSchema = mongoose.Schema({
  name: { type: String },
  mimeType: { type: String },
  fileSyze: { type: Number, required: true },
  s3Url: { type: String },
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
  schmea: metaDataSchema,
});
module.exports = subjectMetadataSchema;
