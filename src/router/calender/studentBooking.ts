import express from "express";
import  { createBooking } from "../../controllers/calender/studentBookingController";


const router = express.Router();

/**
 * @swagger
 * /book:
 *   post:
 *     summary: Book a date with the tutor
 *     tags: [Book]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: integer
 *               tutorId:
 *                 type: integer
 *               selectedDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Booking successfully created
 */
router.post('/book', createBooking);

export default router;
