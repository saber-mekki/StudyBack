import express from "express";
import { addMessageController,getMessages,getConversationBetweenUsers,getUnreadCount,getUsersWithUnread } from "../../controllers/messages";
import { authenticateToken } from "../../helpers";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Messaging between users
 */

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Send a message between two users
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderId:
 *                 type: string
 *               receiverId:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent
 */
router.post("/messages", addMessageController);



/**
 * @swagger
 * /messages/received/{userId}:
 *   get:
 *     summary: Get all messages received by a user
 */
router.get("/messages/received/:userId", getMessages);



/**
 * @swagger
 * /messages/conversation/{user1Id}/{user2Id}:
 *   get:
 *     summary: Get all messages between two users
 */
router.get("/messages/conversation/:user1Id/:user2Id", getConversationBetweenUsers);

router.get("/messages/unread/:userId", getUnreadCount);

router.get("/messages/users-with-unread/:userId", getUsersWithUnread);

export default router;