import multer from "multer";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import { executeSQLQuery } from "../../database";

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const storage = multer.memoryStorage(); // Store file in memory before uploading to S3
const upload = multer({ storage });

export const uploadService = {
  upload,

  uploadImageToS3: async (file: Express.Multer.File) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_PUBLIC!,
      Key: `images/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      CL: "public-read"
    };
    try {
      const data = await s3.upload(params).promise();
      return data.Location; 
    } catch (error) {
      console.error("S3 Upload Error:", error);
      throw new Error("Image upload failed");
    }
  },
 
  saveImage: async (userId: string, imageUrl: string) => {
    await executeSQLQuery("INSERT INTO images (user_id, image_url) VALUES ($1, $2)", [userId, imageUrl]);
  },

  getUserImages: async (userId: string) => {
    const result = await executeSQLQuery("SELECT image_url FROM images WHERE user_id = $1", [userId]);
    return result.rows;
  },
};
