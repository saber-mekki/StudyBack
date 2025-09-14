import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
});

export const uploadPdfToS3 = async (file: Express.Multer.File): Promise<string> => {
  const key = `announcements/${uuidv4()}${path.extname(file.originalname)}`;
  
  const params = {
    Bucket: process.env.AWS_BUCKET_PRIVATE!,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'private',
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    console.error("S3 PDF Upload Error:", error);
    throw new Error("PDF upload failed");
  }
};
