import express from "express";
import {
  getUsersController,
  addUserController,
  deleteUserController,
  getUserController,
  deleteRefreshTokenController,
  getRefreshTokenController,
  loginUserController,
  CheckUserExistController,
  updatePasswordController,
  UpadateUserController,
} from "../../controllers/users";
import { authenticateToken } from "../../helpers";

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: get a the list of users
 *     tags: [User]
 *     parameters:
 *        - in: query
 *          name: userId
 *          required: false
 *          schema:
 *            type: string
 *        - in: query
 *          name: email
 *          required: false
 *          schema:
 *            type: string
 *        - in: query
 *          name: psw
 *          required: false
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: ok
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *       500:
 *         description: error
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *
 *
 */
router.route("/users").get(authenticateToken, getUsersController);
/**
 * @swagger
 * /getUser:
 *   post:
 *     summary: Get User by Email
 *     tags: [User]
 *     requestBody:
 *       description: Retrieve user details by email
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "ex@gmail.com"
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "ex@gmail.com"
 *                     username:
 *                       type: string
 *                       example: "JohnDoe"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
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
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.route("/getUser").post(getUserController);

/**
 * @swagger
 * /updateUser:
 *   post:
 *     summary: Update User Details
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               newEmail:
 *                 type: string
 *                 example: "newjohn@example.com"
 *            
 *               phone_number:
 *                 type: string
 *                 example: "123456789"
 *               gender:
 *                 type: string
 *                 example: "male"
 *               date_of_birth:
 *                 type: string
 *                 example: "2000-01-01"
 * 
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 user:
 *                   type: object
 *                   properties:
 *                     user_name:
 *                       type: string
 *                       example: "John Doe"
 *                     user_email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     newEmail:
 *                       type: string
 *                       example: "newjohn@example.com"
 *                     type_register:
 *                       type: string
 *                       example: "student"
 *                     phone_number:
 *                       type: string
 *                       example: "123456789"
 *                     gender:
 *                       type: string
 *                       example: "male"
 *                     date_of_birth:
 *                       type: string
 *                       example: "2000-01-01"
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */   
router.route("/updateUser").post(UpadateUserController);

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
 *             required:
 *               - id
 *               - name
 *               - email
 *               - password
 *               - type_register
 *               - phone_number
 *               - gender
 *             properties:
 *               id:
 *                 type: string
 *                 example: "user123"
 *               name:
 *                 type: string
 *                 example: "souhail"
 *               email:
 *                 type: string
 *                 example: "souhail@email.com"
 *               password:
 *                 type: string
 *                 example: "DontHackme"
 *               type_register:
 *                 type: string
 *                 example: "student"
 *               phone_number:
 *                 type: string
 *                 example: "+1234567890"
 *               gender:
 *                 type: string
 *                 example: "male"
 *
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
 * /updatePassword:
 *   post:
 *     summary: Update user password
 *     tags: [User]
 *     requestBody:
 *       description: User email and new password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: "ex@email.com"
 *               password:
 *                 type: string
 *                 example: "NewSecurePassword123"
 *
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password updated successfully"
 *       400:
 *         description: Bad request (Invalid input)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid request data"
 *       404:
 *         description: User not found
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

router.route("/updatePassword").post(updatePasswordController);

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
 *                 example: "souhail@gmail.com"
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
router.route("/login").post(loginUserController);

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
 * /checkEmail:
 *   post:
 *     summary: Check if the email exists
 *     tags: [User]
 *     requestBody:
 *       description: Request to check if the email exists in the database
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "souhail@gmail.com"
 *                 required: true
 *     responses:
 *       200:
 *         description: Email check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   example: true  # or false if the email does not exist
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email not found"
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

router.route("/checkEmail").post(CheckUserExistController);

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
