import express from "express";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
import {
    getUserVideos,
    getVideosTest,
    uploadVideo,
    uploadVideoTest,
} from "../../controllers/video";
import { authenticateToken } from "../../helpers";

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
router.post("/upload", upload.single("video"), uploadVideoTest);


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
router.get("/videos", getVideosTest);

/**
 * @swagger
 * /video-upload:
 *   post:
 *     summary: Upload d'une vidéo vers AWS S3
 *     description: Envoie un fichier vidéo et le stocke dans S3
 *     tags:
 *       - awsVideos
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
router.post("/video-upload",authenticateToken, upload.single("video"), uploadVideo);


/**
 * @swagger
 * /user-videos:
 *   get:
 *     summary: Récupérer la liste des vidéos S3
 *     description: Retourne la liste des URLs des vidéos stockées dans S3
 *     tags:
 *       - awsVideos
 *     responses:
 *       200:
 *         description: Succès
 *       500:
 *         description: Erreur serveur
 */
router.get("/user-videos", authenticateToken,getUserVideos);


export default router;
