const express = require("express");
const {
  s3,
  PutObjectCommand,
  GetObjectCommand,
  initializeBucket,
} = require("../config/s3Connection");
const mongoose = require("mongoose");
const subjectMetaModel = require("../modals/SubjectModel");
const { ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const userAuth = require("../middlewares/auth");
const subjectModel = require("../modals/SubjectModel");
const res = require("express/lib/response");
const subjectRouter = express.Router();

subjectRouter.post("/post/files", userAuth, async (req, res, next) => {
  try {
    const { files, moduleId, subjectId } = req.body;
    if (!files || !Array.isArray(files)) {
      return res.status(400).json({
        messageType: "E",
        message: "Please provide an array of files.",
      });
    }
    const BUCKET_NAME = process.env.AMAZON_S3_BUCKET_NAME + `-${subjectId}`;
    const bucket_check = initializeBucket(BUCKET_NAME);
    const presignedUrls = await Promise.all(
      files.map(async (file) => {
        const safeFileName = file.fileName.replace(/\s+/g, "_");
        const objectKey = `modules/${moduleId}/category/${subjectId}/${Date.now()}_${safeFileName}`;
        if ((await bucket_check).messageType == "S") {
          const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: objectKey,
            ContentType: file.type,
            Metadata: {
              moduleId: moduleId,
              subjectId: subjectId,
            },
          });
          const url = await getSignedUrl(s3, command, { expiresIn: 300 });
          try {
            await subjectMetaModel.findOneAndUpdate(
              { learningModuleId: moduleId, categoryId: subjectId },
              {
                $setOnInsert: {
                  id: new mongoose.Types.ObjectId(),
                  learningModuleId: moduleId,
                  categoryId: subjectId,
                },
                $push: {
                  schmea: {
                    id: new mongoose.Types.ObjectId(),
                    fileName: file.fileName,
                    mimeType: file.type,
                    fileSize: file.size || 0,
                    folderPrefix: objectKey,
                  },
                },
              },
              { upsert: true, new: true },
            );
          } catch (saveErr) {
            console.error("Error saving subject metadata:", saveErr);
          }

          return {
            originalName: file.fileName,
            objectKey: objectKey,
            uploadUrl: url,
          };
        } else {
          console.log("bucket not initialized");
        }
      }),
    );
    res.status(200).json({
      messageType: "S",
      urls: presignedUrls,
    });
  } catch (error) {
    res.status(500).json({ messageType: "E", message: error.message });
  }
});

subjectRouter.get(
  "/files/:moduleId/:categoryId",
  userAuth,
  async (req, res, next) => {
    try {
      const { moduleId, categoryId } = req.params;
      const BUCKET_NAME = process.env.AMAZON_S3_BUCKET_NAME + `-${categoryId}`;
      const folderPrefix = `modules/${moduleId}/category/${categoryId}/`;
      const listCommand = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: folderPrefix,
      });

      const s3Objects = await s3.send(listCommand);
      console.log(s3Objects);
      if (!s3Objects.Contents || s3Objects.Contents.length === 0) {
        return res.status(200).json({
          messageType: "S",
          files: [],
        });
      }
      const filesWithUrls = await Promise.all(
        s3Objects.Contents.map(async (item) => {
          const getCommand = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: item.Key,
          });
          const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });
          const rawFileName = item.Key.replace(folderPrefix, "");
          const displayFileName = rawFileName.substring(
            rawFileName.indexOf("_") + 1,
          );

          return {
            objectKey: item.Key,
            fileName: displayFileName || rawFileName,
            size: item.Size,
            lastModified: item.LastModified,
            viewUrl: url,
            ContentType: getCommand.ContentType,
          };
        }),
      );
      res.status(200).json({
        messageType: "S",
        files: filesWithUrls,
      });
    } catch (error) {
      console.error("Error fetching files:", error);
      if (error.name === "NoSuchBucket" || error.name === "NotFound") {
        return res.status(200).json({ messageType: "S", files: [] });
      }
      res.status(500).json({ messageType: "E", message: error.message });
    }
  },
);

module.exports = subjectRouter;
