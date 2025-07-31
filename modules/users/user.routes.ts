import { Router } from "express";
import * as userController from "../../modules/users/user.controller";
import { authenticate } from "../../core/middlewares/auth.middleware";
import { upload } from "../../core/middlewares/upload.middleware";
import { validate } from "../../core/middlewares/validate.middleware";
import { updateProfileSchema, changePasswordSchema, addressSchema, paymentMethodSchema, partialAddressSchema, partialPaymentMethodSchema } from "../../modules/users/user.schema";
import { authorize } from "../../core/middlewares/role.middleware";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and profile-related endpoints
 */


const router = Router();

// Ruta protegida: solo 'employee' o 'admin'
router.get(
    '/dashboard',
    authenticate,
    authorize('employee', 'admin'),
    userController.getUserDashboard
);


// Profile management routes

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authenticate, userController.getProfile);

/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileInput'
 *     responses:
 *       200:
 *         description: The updated user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.patch("/me", authenticate, validate(updateProfileSchema), userController.updateProfile);

/**
 * @swagger
 * /api/users/change-password:
 *   patch:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordInput'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.patch("/change-password", authenticate, validate(changePasswordSchema), userController.changePassword);

/**
 * @swagger
 * /api/users/delete:
 *   delete:
 *     summary: Delete user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/delete", authenticate, userController.deleteAccount);

/**
 * @swagger
 * /api/users/upload-avatar:
 *   put:
 *     summary: Upload user avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.put("/upload-avatar", authenticate, upload.single("avatar"), userController.updateProfilePicture);

/**
 * @swagger
 * /api/users/addresses:
 *   get:
 *     summary: Get user addresses
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of user addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 */
router.get("/addresses", authenticate, userController.getAddresses);

/**
 * @swagger
 * /api/users/addresses:
 *   post:
 *     summary: Add a new address
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       201:
 *         description: The created address
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/addresses", authenticate, validate(addressSchema), userController.addAddress);

/**
 * @swagger
 * /api/users/addresses/{id}:
 *   patch:
 *     summary: Update an address
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PartialAddress'
 *     responses:
 *       200:
 *         description: The updated address
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
router.patch("/addresses/:id", authenticate, validate(partialAddressSchema), userController.updateAddress);

/**
 * @swagger
 * /api/users/addresses/{id}:
 *   delete:
 *     summary: Delete an address
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
router.delete("/addresses/:id", authenticate, userController.deleteAddress);

/**
 * @swagger
 * /api/users/addresses/{id}/set-default:
 *   patch:
 *     summary: Set a default address
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The address ID
 *     responses:
 *       200:
 *         description: Default address set successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
router.patch("/addresses/:id/set-default", authenticate, userController.setDefaultAddress);

/**
 * @swagger
 * /api/users/payment-methods:
 *   get:
 *     summary: Get user payment methods
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of user payment methods
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentMethod'
 *       401:
 *         description: Unauthorized
 */
router.get("/payment-methods", authenticate, userController.getPaymentMethods);

/**
 * @swagger
 * /api/users/payment-methods:
 *   post:
 *     summary: Add a new payment method
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentMethod'
 *     responses:
 *       201:
 *         description: The created payment method
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentMethod'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/payment-methods", authenticate, validate(paymentMethodSchema), userController.addPaymentMethod);

/**
 * @swagger
 * /api/users/payment-methods/{id}:
 *   patch:
 *     summary: Update a payment method
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The payment method ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PartialPaymentMethod'
 *     responses:
 *       200:
 *         description: The updated payment method
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentMethod'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment method not found
 */
router.patch("/payment-methods/:id", authenticate, validate(partialPaymentMethodSchema), userController.updatePaymentMethod);

/**
 * @swagger
 * /api/users/payment-methods/{id}:
 *   delete:
 *     summary: Delete a payment method
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The payment method ID
 *     responses:
 *       200:
 *         description: Payment method deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment method not found
 */
router.delete("/payment-methods/:id", authenticate, userController.deletePaymentMethod);


export default router;