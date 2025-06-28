import mongoose, { Schema, Document } from "mongoose";

export interface CartItem {
  _id?: mongoose.Types.ObjectId; // El usuario puede elegir el mismo producto, pero en dferentes variaciones
  productId: mongoose.Types.ObjectId;
  quantity: number;
  priceAtAddition: number;
  selectedVariation?: string;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<CartItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtAddition: { type: Number, required: true },
    selectedVariation: { type: String },
  },
  { _id: true }
);

const CartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: { type: [CartItemSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<ICart>("Cart", CartSchema);