import { Request, Response } from "express";
import { uploadService } from "../../services/images";

const uploadController = {
  uploadImage: async (req: Request, res: Response) => {
    try {
      console.log({cc:req.file})
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });

      const { userId } = req.body;
     
      if (!userId) return res.status(400).json({ message: "User ID is required" });

      // Upload file to S3
      const imageUrl = await uploadService.uploadImageToS3(req.file);

      // Save image URL in database
      await uploadService.saveImage(userId, imageUrl);

      res.json({ imageUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Image upload failed" });
    }
  },

  getUserImages: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      if (!userId) return res.status(400).json({ message: "User ID is required" });

      const images = await uploadService.getUserImages(userId);
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving images" });
    }
  },
};

export default uploadController;
