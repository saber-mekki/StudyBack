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
  addTutorDetails,
  updateAcceuil,
  UpdateStatusController,
  ShowStatusController
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
router.route("/users").get(getUsersController);
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
 *   post:  
 *     summary: Delete User
 *     tags: [User]
 *     requestBody:
 *       description: Request to check if the email exists in the database
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "b36e6bd4-3db2-4d5e-9593-41346fcabaf9"
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

router.route("/deleteUser").post(deleteUserController);


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
/**
 * @swagger
 * /addTutor:
 *   post:
 *     summary: Add a new tutor
 *     tags: [Tutor]
 *     requestBody:
 *       description: Tutor details including country, price per hour, specialty, degree, languages, and availability
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - country
 *               - price_per_hour
 *               - specialty
 *               - degree
 *               - languages
 *               - availability
 *             properties:
 *               email:
 *                 type: string
 *                 example: "tutor@email.com"
 *               country:
 *                 type: string
 *                 example: "USA"
 *               price_per_hour:
 *                 type: number
 *                 format: decimal
 *                 example: 30.00
 *               specialty:
 *                 type: string
 *                 example: "Math"
 *               degree:
 *                 type: string
 *                 example: "PhD in Mathematics"
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["English", "Spanish"]
 *               availability:
 *                 type: string
 *                 example: "Mon-Fri 9am-5pm"
 *     responses:
 *       200:
 *         description: Tutor added successfully
 *       400:
 *         description: Bad request, missing required fields
 *       500:
 *         description: Internal server error
 */

router.route("/addTutor").post(addTutorDetails);

/**
 * @swagger
 * /updateAcceuil:
 *   post:
 *     summary: Update user bio and photo
 *     tags: [User]
 *     requestBody:
 *       description: User email, new bio, and new photo
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - bio
 *               - photo
 *             properties:
 *               email:
 *                 type: string
 *                 example: "ex@email.com"
 *               bio:
 *                 type: string
 *                 example: "Hi, I'm John Doe. I love EduSkills!"
 *               photo:
 *                 type: string
 *                 example: "http://example.com/path/to/photo.jpg"
 *
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
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
router.route("/updateAcceuil").post(updateAcceuil);


/**
 * @swagger
 * /status:
 *   post:
 *     summary: Update user status
 *     description: Update the status of a user (either "accepted" or "rejected") using their email.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: email
 *                 example: "bf976e49-ef94-43fe-a4b1-9ae4b080186a"
 *               status:
 *                 type: string
 *                 enum:
 *                   - accepted
 *                   - rejected
 *                 description: The new status of the user.
 *                 example: "accepted"
 *     responses:
 *       200:
 *         description: User status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *       400:
 *         description: Invalid status or email.
 *       500:
 *         description: Internal server error.
 */
router.route("/status").post(UpdateStatusController);

/**
 * @swagger
 * /showStatus:
 *   post:
 *     summary: Show the status of the user
 *     description: Fetch the status of a user by their email.
 *     tags:
 *       - Users
 *     requestBody:
 *       description: Email of the user whose status is to be fetched
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: email
 *                 example: "bf976e49-ef94-43fe-a4b1-9ae4b080186a"
 *     responses:
 *       200:
 *         description: Status fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User status fetched successfully"
 *                 status:
 *                   type: string
 *                   example: "activated"
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.route("/showStatus").post(ShowStatusController);

export default router;
