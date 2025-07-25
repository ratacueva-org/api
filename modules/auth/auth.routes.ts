import { Router } from "express";
import * as authController from "../auth/auth.controller";
import { validate } from "../../core/middlewares/validate.middleware";
import { registerSchema, loginSchema, resetPasswordSchema } from "./auth.schema";

const router = Router();


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user account
 *     description: Creates a new user account with email verification. The user will receive an email to verify their account before they can log in.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserInput'
 *           example:
 *             name: "John"
 *             lastName: "Doe"
 *             secondLastName: "Smith"
 *             email: "john.doe@example.com"
 *             password: "SecurePass123!"
 *             phone: "5551234567"
 *             addresses:
 *               - postalCode: "12345"
 *                 street: "Main Street"
 *                 externalNumber: "123"
 *                 neighborhood: "Downtown"
 *                 city: "Mexico City"
 *                 state: "CDMX"
 *                 country: "Mexico"
 *                 isDefault: true
 *             paymentMethods:
 *               - type: "credit_card"
 *                 last4: "1234"
 *                 provider: "Visa"
 *                 expiration: "12/25"
 *     responses:
 *       201:
 *         description: User registered successfully. Verification email sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User registered successfully. Please check your email to verify your account."
 *                 userId:
 *                   type: string
 *                   example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Conflict"
 *                 message:
 *                   type: string
 *                   example: "Email already registered"
 */
router.post("/register", validate(registerSchema), authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user and get access token
 *     description: Authenticates a user using email and password. Returns a JWT token for subsequent API calls. The user must have verified their email address.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserInput'
 *           example:
 *             email: "john.doe@example.com"
 *             password: "SecurePass123!"
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Invalid credentials or unverified email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *                 message:
 *                   type: string
 *                   example: "Invalid email or password, or email not verified"
 */
router.post("/login", validate(loginSchema), authController.login);

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Verify user email address
 *     description: Verifies a user's email address using the token sent to their email during registration. This endpoint must be accessed before the user can log in.
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Email verification token received in the verification email
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Email verified successfully. You can now log in."
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Bad Request"
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired verification token"
 */
router.get("/verify", authController.verifyEmail);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     description: Sends a password reset email to the user's email address. The email will contain a secure token that can be used to reset the password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the account to reset password for
 *                 example: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Password reset email sent. Please check your email for instructions."
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         description: Email not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Not Found"
 *                 message:
 *                   type: string
 *                   example: "No account found with this email address"
 */
router.post("/forgot-password", authController.forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password with token
 *     description: Resets a user's password using the secure token received in the password reset email. The token is valid for a limited time.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordInput'
 *           example:
 *             token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             newPassword: "NewSecurePass123!"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Password reset successfully. You can now log in with your new password."
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Invalid or expired reset token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired password reset token"
 */
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);

/**
 * @swagger
 * /api/auth/reactivate:
 *   get:
 *     summary: Reactivate a deleted user account
 *     description: Reactivates a previously deleted user account using the reactivation token sent to the user's email when the account was deleted.
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Account reactivation token received in the deletion confirmation email
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Account reactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Account reactivated successfully. You can now log in normally."
 *       400:
 *         description: Invalid or expired reactivation token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Bad Request"
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired reactivation token"
 *       404:
 *         description: Account not found or not deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Not Found"
 *                 message:
 *                   type: string
 *                   example: "No deleted account found for this token"
 */
router.get("/reactivate", authController.reactivateAccount);


export default router;