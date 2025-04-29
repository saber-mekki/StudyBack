import express from "express";
import multer from "multer";

const upload = multer({ dest: 'uploads/' });

import {
  CreateCourseController,
  GetAllCoursesController,
  CreatePDFController
  , GetCourseByIdController
} from "../../controllers/courses"

const router = express.Router();
/**
 * @swagger
 * /CreateCourse:
 *   post:
 *     summary: Create a new course
 *     tags: [Course]
 *     requestBody:
 *       description: Course details to create a new course
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - price
 *               - description
 *               - image
 *               - tutor
 *               - date
 *               - level
 *               - duration
 *               - language
 *               - syllabus
 *               - requirements
 *               - tutor_email
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Introduction to React"
 *               category:
 *                 type: string
 *                 example: "Frontend Development"
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 49.99
 *               description:
 *                 type: string
 *                 example: "Learn the basics of React in this comprehensive course."
 *               image:
 *                 type: string
 *                 example: "https://example.com/react-course-image.jpg"
 *               tutor:
 *                 type: string
 *                 example: "John Doe"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-01"
 *               level:
 *                 type: string
 *                 example: "Beginner"
 *               duration:
 *                 type: string
 *                 example: "4 weeks"
 *               language:
 *                 type: string
 *                 example: "English"
 *               syllabus:
 *                 type: string
 *                 example: "React basics, component structure, hooks, and state management."
 *               requirements:
 *                 type: string
 *                 example: "Basic knowledge of JavaScript"
 *               tutor_email:
 *                 type: string
 *                 example: "sou@gmail.com"
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 course_id:
 *                   type: string
 *                   example: "d8f1a8d0-1b2f-4f75-b6c3-d497e2fc93f1"
 *                 title:
 *                   type: string
 *                   example: "Introduction to React"
 *                 category:
 *                   type: string
 *                   example: "Frontend Development"
 *                 price:
 *                   type: number
 *                   format: float
 *                   example: 49.99
 *                 description:
 *                   type: string
 *                   example: "Learn the basics of React in this comprehensive course."
 *                 image:
 *                   type: string
 *                   example: "https://example.com/react-course-image.jpg"
 *                 tutor:
 *                   type: string
 *                   example: "John Doe"
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2025-04-01"
 *                 level:
 *                   type: string
 *                   example: "Beginner"
 *                 duration:
 *                   type: string
 *                   example: "4 weeks"
 *                 language:
 *                   type: string
 *                   example: "English"
 *                 syllabus:
 *                   type: string
 *                   example: "React basics, component structure, hooks, and state management."
 *                 requirements:
 *                   type: string
 *                   example: "Basic knowledge of JavaScript"
 *       400:
 *         description: Bad request (e.g., missing or invalid parameters)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid input"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */

router.route("/CreateCourse").post(upload.any(), CreateCourseController);


/**
 * @swagger
 * /GetAllCourses:
 *   get:
 *     summary: Get all courses
 *     tags: [Course]
 *     responses:
 *       200:
 *         description: A list of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   course_id:
 *                     type: string
 *                     example: "d8f1a8d0-1b2f-4f75-b6c3-d497e2fc93f1"
 *                   title:
 *                     type: string
 *                     example: "Introduction to React"
 *                   category:
 *                     type: string
 *                     example: "Frontend Development"
 *                   price:
 *                     type: number
 *                     format: float
 *                     example: 49.99
 *                   description:
 *                     type: string
 *                     example: "Learn the basics of React in this comprehensive course."
 *                   image:
 *                     type: string
 *                     example: "https://example.com/react-course-image.jpg"
 *                   tutor:
 *                     type: string
 *                     example: "John Doe"
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2025-04-01"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */

router.route("/GetAllCourses").get(GetAllCoursesController);

/**
* @swagger
* /courses/{id}:
*   get:
*     summary: Get a course by ID
*     tags: [Courses]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: The ID of the course
*         schema:
*           type: string
*     responses:
*       200:
*         description: Course found
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Course'
*       404:
*         description: Course not found
*       500:
*         description: Server error
*/
router.get("/courses/:id", GetCourseByIdController);

/**
 * @swagger
 * /uploadpdf:
 *   post:
 *     summary: Upload and associate a PDF to a course
 *     tags: [Course]
 *     requestBody:
 *       description: The PDF file to be associated with a course
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               course_id:
 *                 type: integer
 *                 description: ID of the course to associate the PDF with
 *                 example: 123
 *               pdf_file:
 *                 type: string
 *                 format: binary
 *                 description: PDF file to upload
 *     responses:
 *       201:
 *         description: PDF uploaded and associated with course successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "PDF uploaded and associated successfully"
 *       400:
 *         description: Missing course ID or PDF file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Course ID and PDF file are required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.route("/uploadpdf")
  .post(upload.single('pdf_file'), CreatePDFController);
export default router;
