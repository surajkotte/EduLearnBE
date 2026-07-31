const express = require("express");
const {
  s3,
  PutObjectCommand,
  initializeBucket,
} = require("../config/s3Connection");
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
        const objectKey = `/modules/${moduleId}/category/${subjectId}/${Date.now()}_${safeFileName}`;
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

module.exports = subjectRouter;
