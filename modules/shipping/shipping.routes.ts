/**
 * @swagger
 * components:
 *   schemas:
 *     ShippingAddress:
 *       type: object
 *       properties:
 *         street:
 *           type: string
 *           description: Street address
 *           example: "Main Street 123"
 *         city:
 *           type: string
 *           description: City name
 *           example: "Mexico City"
 *         state:
 *           type: string
 *           description: State or region
 *           example: "CDMX"
 *         postalCode:
 *           type: string
 *           description: Postal code
 *           example: "12345"
 *         country:
 *           type: string
 *           description: Country name
 *           example: "Mexico"
 *     TrackingEvent:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: ["label_created", "picked_up", "in_transit", "out_for_delivery", "delivered", "exception", "returned"]
 *           description: Shipping status
 *           example: "in_transit"
 *         description:
 *           type: string
 *           description: Detailed description of the event
 *           example: "Package is in transit to destination facility"
 *         location:
 *           type: string
 *           description: Location where the event occurred
 *           example: "Mexico City Distribution Center"
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: When the event occurred
 *         estimatedDelivery:
 *           type: string
 *           format: date-time
 *           description: Estimated delivery date (optional)
 *     Shipment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique shipment identifier
 *           example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *         orderId:
 *           type: string
 *           description: Associated order ID
 *           example: "64f8a1b2c3d4e5f6a7b8c9d1"
 *         trackingNumber:
 *           type: string
 *           description: Tracking number for the shipment
 *           example: "1Z999AA1234567890"
 *         carrier:
 *           type: string
 *           description: Shipping carrier name
 *           example: "FedEx"
 *         serviceType:
 *           type: string
 *           description: Type of shipping service
 *           example: "Standard"
 *         weight:
 *           type: number
 *           description: Package weight in kg
 *           example: 2.5
 *         dimensions:
 *           type: object
 *           properties:
 *             length:
 *               type: number
 *               example: 30
 *             width:
 *               type: number
 *               example: 20
 *             height:
 *               type: number
 *               example: 15
 *           description: Package dimensions in cm
 *         shippingAddress:
 *           $ref: '#/components/schemas/ShippingAddress'
 *         currentStatus:
 *           type: string
 *           enum: ["label_created", "picked_up", "in_transit", "out_for_delivery", "delivered", "exception", "returned"]
 *           description: Current shipping status
 *           example: "in_transit"
 *         estimatedDelivery:
 *           type: string
 *           format: date-time
 *           description: Estimated delivery date
 *         actualDelivery:
 *           type: string
 *           format: date-time
 *           description: Actual delivery date (when delivered)
 *         trackingEvents:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TrackingEvent'
 *           description: Array of tracking events
 *         shippingCost:
 *           type: number
 *           description: Cost of shipping
 *           example: 299.99
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the shipment was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the shipment was last updated
 *     CreateShipmentInput:
 *       type: object
 *       required:
 *         - orderId
 *         - carrier
 *         - serviceType
 *         - weight
 *         - shippingAddress
 *       properties:
 *         orderId:
 *           type: string
 *           description: Order ID to create shipment for
 *           example: "64f8a1b2c3d4e5f6a7b8c9d1"
 *         carrier:
 *           type: string
 *           description: Shipping carrier name
 *           example: "FedEx"
 *         serviceType:
 *           type: string
 *           enum: ["Standard", "Express", "Overnight", "Economy"]
 *           description: Type of shipping service
 *           example: "Standard"
 *         weight:
 *           type: number
 *           minimum: 0.1
 *           description: Package weight in kg
 *           example: 2.5
 *         dimensions:
 *           type: object
 *           properties:
 *             length:
 *               type: number
 *               minimum: 1
 *             width:
 *               type: number
 *               minimum: 1
 *             height:
 *               type: number
 *               minimum: 1
 *           description: Package dimensions in cm (optional)
 *         shippingAddress:
 *           $ref: '#/components/schemas/ShippingAddress'
 *     UpdateShipmentStatusInput:
 *       type: object
 *       required:
 *         - status
 *         - description
 *       properties:
 *         status:
 *           type: string
 *           enum: ["label_created", "picked_up", "in_transit", "out_for_delivery", "delivered", "exception", "returned"]
 *           description: New shipping status
 *           example: "delivered"
 *         description:
 *           type: string
 *           description: Description of the status update
 *           example: "Package delivered to recipient"
 *         location:
 *           type: string
 *           description: Location where the event occurred
 *           example: "Customer Address"
 *         estimatedDelivery:
 *           type: string
 *           format: date-time
 *           description: Updated estimated delivery date (optional)
 */

import { Router } from 'express';
import { shippingController } from './shipping.controller';
import { authenticate } from '../../core/middlewares/auth.middleware';
import { authorize } from '../../core/middlewares/role.middleware'
import { validate, validateParams, validateQuery } from '../../core/middlewares/validate.middleware';

import {
    CreateShipmentSchema,
    UpdateShipmentStatusSchema,
    GetShipmentByIdParamSchema,
    GetShipmentByTrackingNumberParamSchema,
    ListShipmentsQuerySchema,
} from './shipping.schema';

const router = Router();

/**
 * @swagger
 * /api/shipping:
 *   post:
 *     summary: Create a new shipment (Admin/Employee only)
 *     description: Creates a new shipment for an order. This is typically called internally when an order is marked as shipped. Only admins and employees can create shipments directly.
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateShipmentInput'
 *           example:
 *             orderId: "64f8a1b2c3d4e5f6a7b8c9d1"
 *             carrier: "FedEx"
 *             serviceType: "Standard"
 *             weight: 2.5
 *             dimensions:
 *               length: 30
 *               width: 20
 *               height: 15
 *             shippingAddress:
 *               street: "Main Street 123"
 *               city: "Mexico City"
 *               state: "CDMX"
 *               postalCode: "12345"
 *               country: "Mexico"
 *     responses:
 *       201:
 *         description: Shipment created successfully
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
 *                   example: "Shipment created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Shipment'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Order not found
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
 *                   example: "Order not found"
 */
router.post(
    '/',
    authenticate,
    authorize('admin', 'employee'), // Solo personal puede crear envíos directamente
    validate(CreateShipmentSchema),
    shippingController.createShipment
);

/**
 * @swagger
 * /api/shipping:
 *   get:
 *     summary: List all shipments with filtering (Admin/Employee only)
 *     description: Retrieves a paginated list of all shipments with optional filtering by status, carrier, or date range. Only admins and employees can access this endpoint.
 *     tags: [Shipping]
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
 *           default: 20
 *         description: Number of shipments per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ["label_created", "picked_up", "in_transit", "out_for_delivery", "delivered", "exception", "returned"]
 *         description: Filter by shipment status
 *       - in: query
 *         name: carrier
 *         schema:
 *           type: string
 *         description: Filter by shipping carrier
 *       - in: query
 *         name: orderId
 *         schema:
 *           type: string
 *         description: Filter by order ID
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter shipments created from this date
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter shipments created until this date
 *     responses:
 *       200:
 *         description: List of shipments retrieved successfully
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
 *                     $ref: '#/components/schemas/Shipment'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                     totalShipments:
 *                       type: integer
 *                       example: 45
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
    '/',
    authenticate,
    authorize('admin', 'employee'), // Solo personal puede listar todos los envíos
    validateQuery(ListShipmentsQuerySchema),
    shippingController.listShipments
);

/**
 * @swagger
 * /api/shipping/{shipmentId}:
 *   get:
 *     summary: Get shipment details by ID
 *     description: Retrieves detailed information about a specific shipment including tracking events and current status. Access is role-based.
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shipmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Shipment ID
 *         example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *     responses:
 *       200:
 *         description: Shipment details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Shipment'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Access denied - insufficient permissions or not your shipment
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
 *                   example: "Access denied to this shipment"
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
    '/:shipmentId',
    authenticate,
    authorize('admin', 'employee', 'client'), // Clientes solo deberían ver los suyos si OrderController los filtra
    validateParams(GetShipmentByIdParamSchema),
    shippingController.getShipmentById
);

/**
 * @swagger
 * /api/shipping/{shipmentId}/status:
 *   patch:
 *     summary: Update shipment status (Admin/Employee only)
 *     description: Updates the status of a shipment and adds a new tracking event. This simulates carrier tracking updates. Only admins and employees can update shipment status.
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shipmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Shipment ID
 *         example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateShipmentStatusInput'
 *           example:
 *             status: "delivered"
 *             description: "Package delivered to recipient"
 *             location: "Customer Address"
 *     responses:
 *       200:
 *         description: Shipment status updated successfully
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
 *                   example: "Shipment status updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Shipment'
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
    '/:shipmentId/status',
    authenticate,
    authorize('admin', 'employee'), // Solo personal puede actualizar el estado
    validateParams(GetShipmentByIdParamSchema),
    validate(UpdateShipmentStatusSchema),
    shippingController.updateShipmentStatus
);

/**
 * @swagger
 * /api/shipping/track/{trackingNumber}:
 *   get:
 *     summary: Track shipment by tracking number
 *     description: Retrieves shipment tracking information using the tracking number. This is the public-facing tracking endpoint that customers can use.
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trackingNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Tracking number for the shipment
 *         example: "1Z999AA1234567890"
 *     responses:
 *       200:
 *         description: Tracking information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     trackingNumber:
 *                       type: string
 *                       example: "1Z999AA1234567890"
 *                     carrier:
 *                       type: string
 *                       example: "FedEx"
 *                     currentStatus:
 *                       type: string
 *                       example: "in_transit"
 *                     estimatedDelivery:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-20T18:00:00Z"
 *                     actualDelivery:
 *                       type: string
 *                       format: date-time
 *                       example: null
 *                     trackingEvents:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TrackingEvent'
 *                     shippingAddress:
 *                       $ref: '#/components/schemas/ShippingAddress'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Tracking number not found
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
 *                   example: "Tracking number not found"
 */
router.get(
    '/track/:trackingNumber',
    authenticate, // Podría hacerse público según sea necesario, pero por seguridad, se mantiene autenticado
    validateParams(GetShipmentByTrackingNumberParamSchema),
    shippingController.getShipmentByTrackingNumber
);

export default router;