import express from "express";
import { CreateBlogController  ,GetAllBlogsController,GetBlogById} from "../../controllers/Blog"; 
const router = express.Router();
/**
 * @swagger
 * /createBlog:
 *   post:
 *     summary: Create a new blog
 *     description: Create a new blog post in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the blog
 *                 example: "My First Blog"
 *               content:
 *                 type: string
 *                 description: The content of the blog post.
 *                 example: "This is the content of the blog post."
 *               email_user:
 *                 type: string
 *                 description: The email of the user creating the blog
 *                 example: "user@example.com"
 *               user_name:
 *                 type: string
 *                 description: The name of the user creating the blog
 *                 example: "ahmed"
 *     responses:
 *       201:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Blog created successfully"
 *                 blog:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier of the blog
 *                       example: "f3ad49ab-6c3f-4ccf-87b9-ec1a6da6993e"
 *                     title:
 *                       type: string
 *                       example: "My First Blog"
 *                     content:
 *                       type: string
 *                       example: "This is the content of the blog post."
 *                     email_user:
 *                       type: string
 *                       example: "user@example.com"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-23T12:34:56Z"
 *       500:
 *         description: Something went wrong while creating the blog
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while creating the blog"
 */

router.route("/createBlog").post(CreateBlogController); 



/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Get all blogs
 *     description: Fetch all blog posts in the system.
 *     responses:
 *       200:
 *         description: Successfully retrieved all blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blogs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The unique identifier of the blog
 *                         example: "f3ad49ab-6c3f-4ccf-87b9-ec1a6da6993e"
 *                       title:
 *                         type: string
 *                         example: "My First Blog"
 *                       content:
 *                         type: string
 *                         example: "This is the content of the blog post."
 *                       email_user:
 *                         type: string
 *                         example: "user@example.com"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-23T12:34:56Z"
 *       404:
 *         description: No blogs found
 *       500:
 *         description: Internal server error
 */

router.route("/blogs").get(GetAllBlogsController);

/**
 * @swagger
 * /blogs/{id}:
 *   get:
 *     summary: Get a blog post by ID
 *     tags:
 *       - Blogs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the blog to fetch
 *     responses:
 *       200:
 *         description: A single blog post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Blog not found
 */

router.route("/blogs/:id").get(GetBlogById);

export default router;
