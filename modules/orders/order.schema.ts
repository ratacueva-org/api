// src/modules/orders/order.schema.ts
import { z } from "zod";
import { OrderStatusValues } from "../orders/order.model"; // Asegúrate de que esta ruta sea correcta

// Esquema para la dirección, reusando tu definición de usuario
const addressZodSchema = z.object({
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

// Esquema para un ítem individual en el payload de creación de orden
const orderItemInputSchema = z.object({
  productId: z.string().min(1, "El ID del producto es requerido."), // Solo valida que sea string no vacío
  quantity: z.number().int().min(1, "La cantidad debe ser al menos 1."),
  selectedVariation: z.string().optional(),
});

// Esquema para el método de pago en el payload de creación de orden
const createOrderPaymentInputSchema = z.object({
  type: z.enum(["credit_card", "debit_card", "paypal", "oxxo_cash"]),
  paymentGatewayToken: z.string().optional(),
  paypalApprovalId: z.string().optional(),
  // Aquí puedes añadir más campos específicos según la pasarela
});

// Esquema para el payload de creación de orden
export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(orderItemInputSchema).min(1, "El pedido debe contener al menos un producto."),
    shippingAddress: addressZodSchema,
    billingAddress: addressZodSchema.optional(),
    paymentMethod: createOrderPaymentInputSchema,
    shippingCost: z.number().min(0, "El costo de envío no puede ser negativo."),
    taxAmount: z.number().min(0, "El monto de impuestos no puede ser negativo."),
    discountAmount: z.number().min(0, "El descuento no puede ser negativo.").optional(),
  }),
});

// Esquema para la actualización del estado de un pedido (admin/empleado)
export const updateOrderStatusSchema = z.object({
  body: z.object({
    newStatus: z.nativeEnum(OrderStatusValues, {
      errorMap: () => ({ message: "Estado de pedido inválido." })
    }),
    notes: z.string().optional(),
  }),
  params: z.object({
    orderId: z.string().min(1, "El ID del pedido es requerido."),
  }),
});

// Esquema para validar el ID del pedido en los parámetros de la URL
export const orderIdParamSchema = z.object({
  params: z.object({
    orderId: z.string().min(1, "El ID del pedido es requerido."),
  }),
});

// Esquema para parámetros de consulta de paginación y filtros
export const paginationQuerySchema = z.object({
  query: z.object({
    page: z.string().transform(Number).pipe(z.number().int().min(1)).default("1").optional(),
    limit: z.string().transform(Number).pipe(z.number().int().min(1)).default("10").optional(),
    status: z.nativeEnum(OrderStatusValues).optional(),
  }),
});

// Esquema para actualizar el estado de pago (ej. desde un webhook o admin)
export const updatePaymentStatusSchema = z.object({
  body: z.object({
    newPaymentStatus: z.enum(["pending", "paid", "refunded", "failed", "partially_refunded"]),
    transactionId: z.string().optional(),
  }),
  params: z.object({
    orderId: z.string().min(1, "El ID del pedido es requerido."),
  }),
});

// Esquema para actualizar detalles de envío (ej. desde un webhook o admin)
export const updateShippingDetailsSchema = z.object({
  body: z.object({
    trackingNumber: z.string().min(1, "El número de seguimiento es requerido."),
    shippingProvider: z.string().min(1, "El proveedor de envío es requerido."),
    estimatedDeliveryDate: z.string().datetime().optional(),
  }),
  params: z.object({
    orderId: z.string().min(1, "El ID del pedido es requerido."),
  }),
});