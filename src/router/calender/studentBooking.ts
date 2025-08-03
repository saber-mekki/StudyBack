import express from "express";
import  { updateBookingController,getAllBookingsController,createBooking ,acceptBookingController,getPendingBookingsController,declineBookingController} from "../../controllers/calender/studentBookingController";


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

/**
 * @swagger
 * /booking/update:
 *   put:
 *     summary: Update booking details
 *     tags: [Booking Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId:
 *                 type: integer
 *               liveLink:
 *                 type: string
 *               selectedDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking updated
 */
router.put('/booking/update', updateBookingController);

/**
 * @swagger
 * /bookings/student/{user_id}:
 *   get:
 *     summary: Get all booking requests for a tutor or a student
 *     tags: [Booking Requests]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *       - in: query
 *         name: itsTutor
 *         required: true
 *         schema:
 *           type: string
 *           enum: [yes, no]
 *         description: Specify if the user is a tutor (yes) or a student (no)
 *     responses:
 *       200:
 *         description: List of pending bookings
 */
router.get('/bookings/student/:user_id', getAllBookingsController);

/**
 * @swagger
 * /tutor/booking-requests/{tutorId}:
 *   get:
 *     summary: Get all pending booking requests for a tutor
 *     tags: [Booking Requests]
 *     parameters:
 *       - in: path
 *         name: tutorId
 *         required: true
 *         schema:
 *         description: ID of the tutor
 *     responses:
 *       200:
 *         description: List of pending bookings
 */
router.get('/tutor/booking-requests/:tutorId', getPendingBookingsController);


/**
 * @swagger
 * /tutor/booking-requests/accept:
 *   post:
 *     summary: Accept a booking request
 *     tags: [Booking Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Booking accepted
 */
router.post('/tutor/booking-requests/accept', acceptBookingController);

/**
 * @swagger
 * /tutor/booking-requests/decline:
 *   post:
 *     summary: Decline a booking request
 *     tags: [Booking Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Booking declined
 */
router.post('/tutor/booking-requests/decline', declineBookingController);


export default router;
