import { Router } from "express";
import { OrderController } from "./order.controller";
import { authenticate } from "../../core/middlewares/auth.middleware";
import { authorize } from "../../core/middlewares/role.middleware";
import { validate, validateQuery, validateParams } from "../../core/middlewares/validate.middleware"; 

import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderIdParamSchema,
  paginationQuerySchema,
  updatePaymentStatusSchema,
  updateShippingDetailsSchema,
} from "./order.schema"; 

const router = Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     description: Creates a new order for the authenticated client. The order will be created with the provided items, addresses, and payment information.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderInput'
 *           example:
 *             items:
 *               - productId: "64f8a1b2c3d4e5f6a7b8c9d1"
 *                 quantity: 2
 *                 selectedVariation: "24GB GDDR6X"
 *               - productId: "64f8a1b2c3d4e5f6a7b8c9d2"
 *                 quantity: 1
 *             shippingAddress:
 *               postalCode: "12345"
 *               street: "Main Street"
 *               externalNumber: "123"
 *               neighborhood: "Downtown"
 *               city: "Mexico City"
 *               state: "CDMX"
 *               country: "Mexico"
 *             billingAddress:
 *               postalCode: "12345"
 *               street: "Main Street"
 *               externalNumber: "123"
 *               neighborhood: "Downtown"
 *               city: "Mexico City"
 *               state: "CDMX"
 *               country: "Mexico"
 *             paymentMethod:
 *               type: "credit_card"
 *               paymentGatewayToken: "tok_1234567890"
 *             shippingCost: 299.99
 *             taxAmount: 11519.99
 *             discountAmount: 1000.00
 *     responses:
 *       201:
 *         description: Order created successfully
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
 *                   example: "Order created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       409:
 *         description: Insufficient stock or payment failed
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
 *                   example: "Insufficient stock for some products or payment processing failed"
 */
router.post(
  "/",
  authenticate,
  authorize("client"), // Solo clientes pueden crear pedidos por esta vía
  validate(createOrderSchema),
  OrderController.createOrder
);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get orders with pagination and filtering
 *     description: Retrieves orders based on user role. Clients see only their own orders, while employees and admins can see all orders. Supports pagination and status filtering.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of orders per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"]
 *         description: Filter orders by status
 *     responses:
 *       200:
 *         description: List of orders with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     totalOrders:
 *                       type: integer
 *                       example: 45
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
  "/",
  authenticate,
  authorize("client", "employee", "admin"),
  validateQuery(paginationQuerySchema),
  OrderController.getOrders
);

/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Get order details by ID
 *     description: Retrieves detailed information about a specific order. Clients can only view their own orders, while employees and admins can view any order.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *         example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Access denied - can only view own orders or insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden"
 *                 message:
 *                   type: string
 *                   example: "You can only view your own orders"
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  "/:orderId",
  authenticate,
  authorize("client", "employee", "admin"),
  validateParams(orderIdParamSchema),
  OrderController.getOrderDetail
);

/**
 * @swagger
 * /api/orders/{orderId}/cancel:
 *   patch:
 *     summary: Cancel an order
 *     description: Cancels an order. Clients can only cancel their own orders, while employees and admins can cancel any order. Orders can only be cancelled if they haven't been shipped yet.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID to cancel
 *         example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *     responses:
 *       200:
 *         description: Order cancelled successfully
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
 *                   example: "Order cancelled successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Order cannot be cancelled
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
 *                   example: "Order cannot be cancelled as it has already been shipped"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Access denied - can only cancel own orders or insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden"
 *                 message:
 *                   type: string
 *                   example: "You can only cancel your own orders"
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.patch(
  "/:orderId/cancel",
  authenticate,
  authorize("client", "employee", "admin"),
  validateParams(orderIdParamSchema),
  OrderController.cancelOrder
);

/**
 * @swagger
 * /api/orders/{orderId}/status:
 *   patch:
 *     summary: Update order status (Admin/Employee only)
 *     description: Updates the status of an order. Only admins and employees can perform this action.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *         example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderStatusInput'
 *           example:
 *             newStatus: "shipped"
 *             notes: "Order shipped via FedEx"
 *     responses:
 *       200:
 *         description: Order status updated successfully
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
 *                   example: "Order status updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.patch(
  "/:orderId/status",
  authenticate,
  authorize("admin", "employee"),
  validateParams(orderIdParamSchema),
  validate(updateOrderStatusSchema),
  OrderController.updateOrderStatus
);

/**
 * @swagger
 * /api/orders/{orderId}/payment-status:
 *   patch:
 *     summary: Update payment status (Admin/Employee only)
 *     description: Updates the payment status of an order. Only admins and employees can perform this action.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *         example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePaymentStatusInput'
 *           example:
 *             newPaymentStatus: "paid"
 *             transactionId: "txn_1234567890"
 *     responses:
 *       200:
 *         description: Payment status updated successfully
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
 *                   example: "Payment status updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.patch(
  "/:orderId/payment-status",
  authenticate,
  authorize("admin", "employee"),
  validateParams(orderIdParamSchema),
  validate(updatePaymentStatusSchema),
  OrderController.updatePaymentStatus
);

/* router.patch(
  "/:orderId/shipping-details",
  authenticate,
  authorize("admin", "employee"),
  validateParams(orderIdParamSchema),
  validate(updateShippingDetailsSchema),
  OrderController.updateShippingDetails
); */

export default router;