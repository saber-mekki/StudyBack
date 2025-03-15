import express from "express";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
import {
    getVideos,
    uploadVideo,
} from "../../controllers/video";

const router = express.Router();

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload d'une vidéo vers AWS S3
 *     description: Envoie un fichier vidéo et le stocke dans S3
 *     tags:
 *       - Videos
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Succès
 *       500:
 *         description: Erreur serveur
 */
router.post("/upload", upload.single("video"), uploadVideo);


/**
 * @swagger
 * /videos:
 *   get:
 *     summary: Récupérer la liste des vidéos S3
 *     description: Retourne la liste des URLs des vidéos stockées dans S3
 *     tags:
 *       - Videos
 *     responses:
 *       200:
 *         description: Succès
 *       500:
 *         description: Erreur serveur
 */
router.get("/videos", getVideos);

export default router;
