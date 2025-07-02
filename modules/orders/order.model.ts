import mongoose, { Schema, Document } from "mongoose";
import { Address } from "../users/user.model";

export const OrderStatusValues = {
  PENDING: "pending", // Pendiente de pago/confirmación
  PROCESSING: "processing", // Pago confirmado, preparando envío
  SHIPPED: "shipped", // Enviado
  DELIVERED: "delivered", // Entregado al cliente
  CANCELLED: "cancelled", // Cancelado por cliente/administrador
  REFUNDED: "refunded", // Reembolsado
  PAYMENT_FAILED: "payment_failed", // Fallo en el pago
  ON_HOLD: "on_hold", // Retenido (ej. para verificación manual)
} as const;

export type OrderStatusType = (typeof OrderStatusValues)[keyof typeof OrderStatusValues];

export const PaymentStatusValues = {
  PENDING: "pending", // Pago no iniciado o en progreso
  PAID: "paid", // Pago exitoso
  REFUNDED: "refunded", // Totalmente reembolsado
  FAILED: "failed", // Fallo en la transacción de pago
  PARTIALLY_REFUNDED: "partially_refunded", // Parcialmente reembolsado
} as const;
export type PaymentStatusType = (typeof PaymentStatusValues)[keyof typeof PaymentStatusValues];

export const ShippingStatusValues = {
  PENDING: "pending", // En espera de ser procesado/empaquetado
  SHIPPED: "shipped", // En tránsito
  DELIVERED: "delivered", // Entregado
  RETURNED: "returned", // Devuelto al remitente
  EXCEPTION: "exception", // Incidencia en la entrega
} as const;
export type ShippingStatusType = (typeof ShippingStatusValues)[keyof typeof ShippingStatusValues];


// --- INTERFACES DE SUBDOCUMENTOS ---


// Interfaz para los ítems del pedido (copia de los detalles del producto al momento de la compra)
export interface IOrderItem {
  _id: mongoose.Types.ObjectId; // Un ID único para este ítem dentro del array del pedido
  productId: mongoose.Types.ObjectId; // Referencia al ID del producto original
  name: string; // Nombre del producto al momento de la compra
  priceAtAddition: number; // Precio unitario del producto al momento de la compra
  quantity: number;
  selectedVariation?: string; // Variación seleccionada (ej. "Color: Rojo", "Capacidad: 250GB")
  imageUrl?: string; // URL de la imagen principal del producto al momento de la compra
  discountPercentageApplied?: number; // Descuento aplicado a este ítem al momento de la compra
}

// Interfaz para los detalles de pago (solo información no sensible y de referencia)
export interface IOrderPaymentDetails {
  type: "credit_card" | "debit_card" | "paypal" | "oxxo_cash"; // Tipo de método de pago
  last4?: string; // Últimos 4 dígitos de la tarjeta (si aplica)
  provider?: string; // Proveedor de la pasarela (ej. "Stripe", "PayPal")
  transactionId: string; // ID de la transacción en la pasarela de pago (MANDATORIO)
  // No almacenar datos sensibles como número completo de tarjeta o CVC
}


// --- INTERFAZ PRINCIPAL DEL MODELO ORDER ---

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Referencia al ID del usuario que realizó el pedido
  items: IOrderItem[]; // Array de subdocumentos con los ítems del pedido

  // Detalles financieros del pedido
  subtotal: number; // Suma de (priceAtAddition * quantity) de todos los ítems
  shippingCost: number; // Costo del envío
  taxAmount: number; // Cantidad total de impuestos
  discountAmount: number; // Descuento total aplicado al pedido (ej. por un cupón)
  totalAmount: number; // subtotal + shippingCost + taxAmount - discountAmount
  currency: string; // Moneda del pedido (ej. "MXN", "USD")

  // Estados del pedido
  orderStatus: OrderStatusType;
  paymentStatus: PaymentStatusType;
  shippingStatus: ShippingStatusType;

  // Direcciones
  shippingAddress: Address; // Copia completa de la dirección de envío al momento del pedido
  billingAddress?: Address; // Copia completa de la dirección de facturación (opcional, si es diferente a la de envío)

  // Detalles del pago
  paymentDetails: IOrderPaymentDetails; // Subdocumento con los detalles no sensibles del pago

  // Información de envío y logística
  trackingNumber?: string; // Número de seguimiento del envío
  shippingProvider?: string; // Nombre del proveedor de envío (ej. "DHL", "FedEx")
  estimatedDeliveryDate?: Date; // Fecha estimada de entrega
  shippedAt?: Date; // Fecha en que el pedido fue enviado
  deliveredAt?: Date; // Fecha en que el pedido fue entregado

  // Fechas de estado especiales
  cancelledAt?: Date; // Fecha en que el pedido fue cancelado
  refundedAt?: Date; // Fecha en que el pedido fue reembolsado

  notes?: string; // Notas internas para el administrador o empleado
  // source?: 'web' | 'pos'; // Si el pedido viene de diferentes canales (web, punto de venta)

  createdAt: Date;
  updatedAt: Date;
}


// --- ESQUEMAS DE MONGODB PARA SUBDOCUMENTOS ---

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
    name: { type: String, required: true },
    priceAtAddition: { type: Number, required: true },
    quantity: { type: Number, required: true },
    selectedVariation: { type: String },
    imageUrl: { type: String },
    discountPercentageApplied: { type: Number, default: 0 },
  },
  { _id: true }
);

const OrderPaymentDetailsSchema = new Schema<IOrderPaymentDetails>(
  {
    type: { type: String, enum: ["credit_card", "debit_card", "paypal", "oxxo_cash"], required: true },
    last4: { type: String },
    provider: { type: String },
    transactionId: { type: String, required: true }, // Crucial para la referencia del pago
  },
  { _id: false } // No necesitamos un _id para este subdocumento incrustado
);

const AddressSchema = new Schema<Address>(
  {
    postalCode: { type: String, required: true },
    street: { type: String, required: true },
    externalNumber: { type: String },
    internalNumber: { type: String },
    neighborhood: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);


// --- ESQUEMA PRINCIPAL DEL MODELO ORDER ---

const OrderSchema: Schema<IOrder> = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    items: { type: [OrderItemSchema], required: true },

    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    currency: { type: String, required: true, default: "MXN" },

    orderStatus: {
      type: String,
      enum: Object.values(OrderStatusValues),
      default: OrderStatusValues.PENDING,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatusValues),
      default: PaymentStatusValues.PENDING,
      required: true,
    },
    shippingStatus: {
      type: String,
      enum: Object.values(ShippingStatusValues),
      default: ShippingStatusValues.PENDING,
      required: true,
    },

    shippingAddress: { type: AddressSchema, required: true },
    billingAddress: { type: AddressSchema },

    paymentDetails: { type: OrderPaymentDetailsSchema, required: true },

    trackingNumber: { type: String },
    shippingProvider: { type: String },
    estimatedDeliveryDate: { type: Date },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
    refundedAt: { type: Date },

    notes: { type: String },
    // source: { type: String, enum: ['web', 'pos'], default: 'web' }, // Si se usa

  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOrder>("Order", OrderSchema);