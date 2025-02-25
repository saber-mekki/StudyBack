import express from "express";
import { getUsersController,addUserController, deleteUserController, loginController,getRefreshTokenController,deleteRefreshTokenController } from "../../controllers/users";
import { authenticateToken } from "../../helpers";


const router = express.Router();


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []  # Requires authentication
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: psw
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized - No token provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Null token"
 *       403:
 *         description: Forbidden - Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid or expired token"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.route("/users").get(authenticateToken,getUsersController);

// router.get("/users", authenticateToken, getUsersController);

/**
 * @swagger
 * /addUser:
 *   post:
 *     summary: Add a new user
 *     tags: [User]
 *     requestBody:
 *       description: User login and password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "user123"
 *                 required: true
 *               password:
 *                 type: string
 *                 example: "password123"
 *                 required: true
 *               registerType:
 *                 type: string
 *                 example: "male"
 *                 required: false
 *               email:
 *                 type: string
 *                 example: "test@test.com"
 *                 required: true
 *     responses:
 *       200:
 *         description: User added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User added successfully"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
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
router.route("/addUser").post(addUserController);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     requestBody:
 *       description: User login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "test@test.com"
 *                 required: true
 *               password:
 *                 type: string
 *                 example: "password123"
 *                 required: true
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
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
router.route("/login").post(loginController);

/**
 * @swagger
 * /deleteUser:
 *   delete:
 *     summary: Delete a user by login
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: login
 *         schema:
 *           type: string
 *         required: true
 *         description: The login of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
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
router.route("/deleteUser").delete(deleteUserController);



/**
 * @swagger
 * /refresh_token:
 *   get:
 *     summary: Refresh authentication token
 *     tags: [Auth]
 *     description: Retrieves a new access token using the refresh token stored in cookies.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully refreshed tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "new-access-token"
 *                 refreshToken:
 *                   type: string
 *                   example: "new-refresh-token"
 *       401:
 *         description: Unauthorized - No refresh token provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No refresh token found in cookies"
 *       403:
 *         description: Forbidden - Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid refresh token"
 */
router.route("/refresh_token").get(getRefreshTokenController);


/**
 * @swagger
 * /refresh_token:
 *   delete:
 *     summary: Delete refresh token
 *     tags: [Auth]
 *     description: Removes the refresh token from cookies.
 *     responses:
 *       200:
 *         description: Successfully deleted refresh token
 *       401:
 *         description: Unauthorized - Error while deleting token
 */
router.route("/refresh_token").delete(deleteRefreshTokenController);


export default router;
