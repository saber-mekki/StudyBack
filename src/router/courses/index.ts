import express from "express";

import{
  CreateCourseController,
  GetAllCoursesController
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
 *         application/json:
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

router.route("/CreateCourse").post(CreateCourseController);


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


export default router;
