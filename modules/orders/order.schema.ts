/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *           description: Product ID in the order
 *           example: "64f8a1b2c3d4e5f6a7b8c9d1"
 *         productName:
 *           type: string
 *           description: Product name (populated from product)
 *           example: "NVIDIA GeForce RTX 4090"
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Quantity ordered
 *           example: 2
 *         unitPrice:
 *           type: number
 *           description: Unit price at time of order
 *           example: 35999.99
 *         totalPrice:
 *           type: number
 *           description: Total price for this item (unitPrice * quantity)
 *           example: 71999.98
 *         selectedVariation:
 *           type: string
 *           description: Selected product variation (optional)
 *           example: "24GB GDDR6X"
 *     OrderAddress:
 *       type: object
 *       required:
 *         - postalCode
 *         - street
 *         - neighborhood
 *         - city
 *         - state
 *         - country
 *       properties:
 *         postalCode:
 *           type: string
 *           description: Postal code
 *           example: "12345"
 *         street:
 *           type: string
 *           description: Street name
 *           example: "Main Street"
 *         externalNumber:
 *           type: string
 *           description: External number (optional)
 *           example: "123"
 *         internalNumber:
 *           type: string
 *           description: Internal number (optional)
 *           example: "4B"
 *         neighborhood:
 *           type: string
 *           description: Neighborhood
 *           example: "Downtown"
 *         city:
 *           type: string
 *           description: City
 *           example: "Mexico City"
 *         state:
 *           type: string
 *           description: State
 *           example: "CDMX"
 *         country:
 *           type: string
 *           description: Country
 *           example: "Mexico"
 *         isDefault:
 *           type: boolean
 *           description: Whether this is the default address
 *           example: true
 *     OrderPaymentMethod:
 *       type: object
 *       required:
 *         - type
 *       properties:
 *         type:
 *           type: string
 *           enum: ["credit_card", "debit_card", "paypal", "oxxo_cash"]
 *           description: Payment method type
 *           example: "credit_card"
 *         paymentGatewayToken:
 *           type: string
 *           description: Payment gateway token (optional)
 *           example: "tok_1234567890"
 *         paypalApprovalId:
 *           type: string
 *           description: PayPal approval ID (optional)
 *           example: "PAY-1234567890"
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique order identifier
 *           example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *         orderNumber:
 *           type: string
 *           description: Human-readable order number
 *           example: "ORD-2024-001234"
 *         userId:
 *           type: string
 *           description: User ID who placed the order
 *           example: "64f8a1b2c3d4e5f6a7b8c9d2"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *           description: Array of ordered items
 *         shippingAddress:
 *           $ref: '#/components/schemas/OrderAddress'
 *         billingAddress:
 *           $ref: '#/components/schemas/OrderAddress'
 *         paymentMethod:
 *           $ref: '#/components/schemas/OrderPaymentMethod'
 *         status:
 *           type: string
 *           enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"]
 *           description: Current order status
 *           example: "confirmed"
 *         paymentStatus:
 *           type: string
 *           enum: ["pending", "paid", "refunded", "failed", "partially_refunded"]
 *           description: Payment status
 *           example: "paid"
 *         subtotal:
 *           type: number
 *           description: Subtotal before taxes and shipping
 *           example: 71999.98
 *         taxAmount:
 *           type: number
 *           description: Tax amount
 *           example: 11519.99
 *         shippingCost:
 *           type: number
 *           description: Shipping cost
 *           example: 299.99
 *         discountAmount:
 *           type: number
 *           description: Discount amount applied
 *           example: 1000.00
 *         totalAmount:
 *           type: number
 *           description: Final total amount
 *           example: 82819.96
 *         trackingNumber:
 *           type: string
 *           description: Shipping tracking number (optional)
 *           example: "1Z999AA1234567890"
 *         shippingProvider:
 *           type: string
 *           description: Shipping provider (optional)
 *           example: "FedEx"
 *         estimatedDeliveryDate:
 *           type: string
 *           format: date-time
 *           description: Estimated delivery date (optional)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Order creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Order last update date
 *     CreateOrderInput:
 *       type: object
 *       required:
 *         - items
 *         - paymentMethod
 *         - shippingCost
 *         - taxAmount
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: Product ID to order
 *                 example: "64f8a1b2c3d4e5f6a7b8c9d1"
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Quantity to order
 *                 example: 2
 *               selectedVariation:
 *                 type: string
 *                 description: Selected product variation (optional)
 *                 example: "24GB GDDR6X"
 *           minItems: 1
 *           description: Array of items to order
 *         shippingAddress:
 *           $ref: '#/components/schemas/OrderAddress'
 *         billingAddress:
 *           $ref: '#/components/schemas/OrderAddress'
 *         paymentMethod:
 *           $ref: '#/components/schemas/OrderPaymentMethod'
 *         shippingCost:
 *           type: number
 *           minimum: 0
 *           description: Shipping cost
 *           example: 299.99
 *         taxAmount:
 *           type: number
 *           minimum: 0
 *           description: Tax amount
 *           example: 11519.99
 *         discountAmount:
 *           type: number
 *           minimum: 0
 *           description: Discount amount (optional)
 *           example: 1000.00
 *     UpdateOrderStatusInput:
 *       type: object
 *       required:
 *         - newStatus
 *       properties:
 *         newStatus:
 *           type: string
 *           enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"]
 *           description: New order status
 *           example: "shipped"
 *         notes:
 *           type: string
 *           description: Optional notes about the status change
 *           example: "Order shipped via FedEx"
 *     UpdatePaymentStatusInput:
 *       type: object
 *       required:
 *         - newPaymentStatus
 *       properties:
 *         newPaymentStatus:
 *           type: string
 *           enum: ["pending", "paid", "refunded", "failed", "partially_refunded"]
 *           description: New payment status
 *           example: "paid"
 *         transactionId:
 *           type: string
 *           description: Transaction ID from payment gateway (optional)
 *           example: "txn_1234567890"
 *     UpdateShippingDetailsInput:
 *       type: object
 *       required:
 *         - trackingNumber
 *         - shippingProvider
 *       properties:
 *         trackingNumber:
 *           type: string
 *           description: Shipping tracking number
 *           example: "1Z999AA1234567890"
 *         shippingProvider:
 *           type: string
 *           description: Shipping provider name
 *           example: "FedEx"
 *         estimatedDeliveryDate:
 *           type: string
 *           format: date-time
 *           description: Estimated delivery date (optional)
 *           example: "2024-01-15T10:00:00Z"
 */

import { z } from "zod";
// Asegúrate de que esta ruta sea 100% correcta para tu OrderStatusValues
import { OrderStatusValues } from "../orders/order.model";

// Dirección (reutilizable)
export const addressZodSchema = z.object({
  postalCode: z.string().min(1, "El código postal es requerido."),
  street: z.string().min(1, "La calle es requerida."),
  externalNumber: z.string().optional(),
  internalNumber: z.string().optional(),
  neighborhood: z.string().min(1, "La colonia es requerida."),
  city: z.string().min(1, "La ciudad es requerida."),
  state: z.string().min(1, "El estado es requerido."),
  country: z.string().min(1, "El país es requerido."),
  isDefault: z.boolean().default(false).optional(),
});

// Ítems del pedido
const orderItemInputSchema = z.object({
  productId: z.string().min(1, "El ID del producto es requerido."),
  quantity: z.number().int().min(1, "La cantidad debe ser al menos 1."),
  selectedVariation: z.string().optional(),
});

// Método de pago
const createOrderPaymentInputSchema = z.object({
  type: z.enum(["credit_card", "debit_card", "paypal", "oxxo_cash"]),
  paymentGatewayToken: z.string().optional(),
  paypalApprovalId: z.string().optional(),
});

// Esquema para el payload de creación de orden (Directamente req.body)
export const createOrderSchema = z.object({
  items: z.array(orderItemInputSchema).min(1, "El pedido debe contener al menos un producto."),
  shippingAddress: addressZodSchema.optional(),
  billingAddress: addressZodSchema.optional(),
  paymentMethod: createOrderPaymentInputSchema,  shippingCost: z.number().min(0, "El costo de envío no puede ser negativo."),
  taxAmount: z.number().min(0, "El monto de impuestos no puede ser negativo."),
  discountAmount: z.number().min(0, "El descuento no puede ser negativo.").optional(),
});

// Esquema para la actualización del estado de un pedido (Directamente req.body)
export const updateOrderStatusSchema = z.object({
  newStatus: z.nativeEnum(OrderStatusValues, {
    errorMap: () => ({ message: "Estado de pedido inválido." })
  }),
  notes: z.string().optional(),
});

// Esquema para validar el ID del pedido en los parámetros de la URL (Directamente req.params)
export const orderIdParamSchema = z.object({
  orderId: z.string().min(1, "El ID del pedido es requerido."),
});

// Esquema para parámetros de consulta de paginación y filtros (Directamente req.query)
export const paginationQuerySchema = z.object({
  page: z
    .string()
    .transform(Number)
    .pipe(z.number().int().min(1))
    .default("1")
    .optional(),
  limit: z
    .string()
    .transform(Number)
    .pipe(z.number().int().min(1))
    .default("10")
    .optional(),
  status: z.nativeEnum(OrderStatusValues).optional(),
});

// Esquema para actualizar el estado de pago (Directamente req.body)
export const updatePaymentStatusSchema = z.object({
  newPaymentStatus: z.enum(["pending", "paid", "refunded", "failed", "partially_refunded"]),
  transactionId: z.string().optional(),
});

// Esquema para actualizar detalles de envío (Directamente req.body)
export const updateShippingDetailsSchema = z.object({
  trackingNumber: z.string().min(1, "El número de seguimiento es requerido."),
  shippingProvider: z.string().min(1, "El proveedor de envío es requerido."),
  estimatedDeliveryDate: z.string().datetime().optional(),
});