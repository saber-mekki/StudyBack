import express from "express";
import  { getAvailability, createAvailability, updateAvailability, removeAvailability} from '../../controllers/calender/tutorAvailabilityController';

const router = express.Router();

/**
 * @swagger
 * /tutor/availability/{tutorId}:
 *   get:
 *     summary: Get tutor's availability
 *     parameters:
 *       - in: path
 *         name: tutorId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of available dates for the tutor
 */
router.get('/tutor/availability/:tutorId', getAvailability);

/**
 * @swagger
 * /tutor/availability:
 *   post:
 *     summary: Add availability for a tutor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tutorId:
 *                 type: integer
 *               availableDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Availability added
 */
router.post('/tutor/availability', createAvailability);

/**
 * @swagger
 * /tutor/availability/update:
 *   put:
 *     summary: Update tutor's availability status (available, booked, unavailable)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tutorId:
 *                 type: integer
 *               availableDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum:
 *                   - available
 *                   - booked
 *                   - unavailable
 *     responses:
 *       200:
 *         description: Availability status updated
 */
router.put('/tutor/availability/update', updateAvailability);

/**
 * @swagger
 * /tutor/availability/remove:
 *   delete:
 *     summary: Remove a tutor's availability
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tutorId:
 *                 type: integer
 *               availableDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Availability removed
 */
router.delete('/tutor/availability/remove', removeAvailability);


export default router;
