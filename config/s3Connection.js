const dotenv = require("dotenv");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

dotenv.config();

const s3 = new S3Client({
  endpoint: process.env.AMAZON_S3_ENDPOINT,
  region: process.env.AMAZON_S3_REGION,
  credentials: {
    accessKeyId: process.env.AMAZON_S3_ACCESS_KEY,
    secretAccessKey: process.env.AMAZON_S3_SECRET_KEY,
  },
  forcePathStyle: true, // Crucial for MinIO
});

const initializeBucket = async (bucket) => {
  const BUCKET_NAME = bucket;
  console.log(BUCKET_NAME);
  if (!BUCKET_NAME) return { messageType: "E" };
  try {
    await s3.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
    console.log("in try");

    return { messageType: "S" };
  } catch (error) {
    console.log(error);
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      try {
        await s3.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
        return { messageType: "S" };
      } catch (createError) {
        return { messageType: "E" };
      }
    } else {
      return { messageType: "E" };
    }
  }
};

module.exports = {
  s3,
  PutObjectCommand,
  initializeBucket,
  GetObjectCommand,
  getSignedUrl,
};
