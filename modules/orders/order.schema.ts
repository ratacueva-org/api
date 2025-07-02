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
  shippingAddress: addressZodSchema,
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