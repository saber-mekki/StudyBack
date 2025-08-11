import express from "express";
import {
  createGroupController,
  getGroupsController,
  getGroupByIdController,
  addStudentToGroupController,
  getGroupStudentsController,
  createSessionController,
  getGroupSessionsController,
} from "../../controllers/groups";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: API for managing study groups
 */

/**
 * @swagger
 * /groups:
 *   post:
 *     tags: [Groups]
 *     summary: Create a new group
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               tutor_id:
 *                 type: integer
 *               schedule_mode:
 *                 type: string
 *                 enum: [daily, ranged]
 *               daily_start:
 *                 type: string
 *                 format: time
 *               daily_end:
 *                 type: string
 *                 format: time
 *               range_start_date:
 *                 type: string 
 *                 format: date
 *               range_end_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Group created successfully
 *       500:
 *         description: Internal server error
 */
router.post("/groups", createGroupController);

/**
 * @swagger
 * /groups:
 *   get:
 *     tags: [Groups]
 *     summary: Retrieve all groups
 *     responses:
 *       200:
 *         description: List of groups
 *       500:
 *         description: Internal server error
 */
router.get("/groups", getGroupsController);

/**
 * @swagger
 * /groups/{id}:
 *   get:
 *     tags: [Groups]
 *     summary: Get group by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Group details
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */
router.get("/groups/:id", getGroupByIdController);

/**
 * @swagger
 * /groups/students:
 *   post:
 *     tags: [Groups]
 *     summary: Add a student to a group
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               group_id:
 *                 type: integer
 *               student_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Student added to group
 *       500:
 *         description: Internal server error
 */
router.post("/groups/students", addStudentToGroupController);

/**
 * @swagger
 * /groups/{group_id}/students:
 *   get:
 *     tags: [Groups]
 *     summary: Get students in a group
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of students
 *       500:
 *         description: Internal server error
 */
router.get("/groups/:group_id/students", getGroupStudentsController);

/**
 * @swagger
 * /groups/sessions:
 *   post:
 *     tags: [Groups]
 *     summary: Create a session for a group
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               group_id:
 *                 type: integer
 *               session_date:
 *                 type: string
 *                 format: date
 *               start_time:
 *                 type: string
 *                 format: time
 *               end_time:
 *                 type: string
 *                 format: time
 *               meeting_link:
 *                 type: string
 *     responses:
 *       201:
 *         description: Session created
 *       500:
 *         description: Internal server error
 */
router.post("/groups/sessions", createSessionController);

/**
 * @swagger
 * /groups/{group_id}/sessions:
 *   get:
 *     tags: [Groups]
 *     summary: Get sessions of a group
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of sessions
 *       500:
 *         description: Internal server error
 */
router.get("/groups/:group_id/sessions", getGroupSessionsController);

export default router;
