import mongoose, { Schema, Document } from "mongoose";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface ShippingAddress {
  postalCode: string;
  street: string;
  externalNumber?: string;
  internalNumber?: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: "credit_card" | "debit_card" | "paypal" | "oxxo_cash";
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  refundedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<OrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const ShippingAddressSchema = new Schema<ShippingAddress>(
  {
    postalCode: { type: String, required: true },
    street: { type: String, required: true },
    externalNumber: { type: String },
    internalNumber: { type: String },
    neighborhood: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [OrderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "paypal", "oxxo_cash"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"],
      default: "pending",
    },
    shippingAddress: { type: ShippingAddressSchema, required: true },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
    refundedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOrder>("Order", OrderSchema);