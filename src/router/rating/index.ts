import express from "express";
import { addRatingController, getTutorRatingController } from "../../controllers/rating";
import { authenticateToken } from "../../helpers";

const router = express.Router();

/**
 * @swagger
 * /rating:
 *   post:
 *     summary: Add a rating for a tutor
 *     tags: [Rating]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tutor_id:
 *                 type: integer
 *               student_id:
 *                 type: integer
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rating added
 */
router.post("/rating", addRatingController);

/**
 * @swagger
 * /rating/{tutorId}:
 *   get:
 *     summary: Get average rating and total reviews of a tutor
 *     tags: [Rating]
 *     parameters:
 *       - in: path
 *         name: tutorId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Average rating data
 */
router.get("/rating/:tutorId", getTutorRatingController);

export default router;
