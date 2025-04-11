import express from "express";
import uploadController from "../../controllers/images";
import { uploadService } from "../../services/images";

const router = express.Router();

// Upload an image (Multer middleware applied)
router.post("/upload-images", uploadService.upload.single("image"), uploadController.uploadImage);

// Get all images of a user
router.get("/images/:userId", uploadController.getUserImages);

export default router;