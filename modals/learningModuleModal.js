const express = require("express");
const mongoose = require("mongoose");
const learningModuleSchema = require("../schemas/learningModuleSchema");
const LearningModule = mongoose.model("LearningModule", learningModuleSchema);
module.exports = LearningModule;
