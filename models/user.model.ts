// models/user.model.ts
import mongoose, { Schema, Document } from "mongoose";

export type Role = "client" | "employee" | "admin";

interface Address {
  postalCode: string;
  street: string;
  externalNumber?: string;
  internalNumber?: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
}

interface PaymentMethod {
  type: "credit_card" | "debit_card" | "paypal" | "oxxo_cash";
  last4?: string;
  provider?: string;
  expiration?: string; // MM/YY
}

export interface IUser extends Document {
  name: string;
  lastName: string;
  secondLastName: string
  email: string;
  password: string;
  role: Role;
  phone?: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  avatarUrl?: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

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

const PaymentMethodSchema = new Schema<PaymentMethod>(
  {
    type: { type: String, enum: ["credit_card", "debit_card", "paypal", "oxxo_cash"], required: true },
    last4: { type: String },
    provider: { type: String },
    expiration: { type: String },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    secondLastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["client", "employee", "admin"],
      default: "client",
    },
    phone: { type: String },
    addresses: { type: [AddressSchema], default: [] },
    paymentMethods: { type: [PaymentMethodSchema], default: [] },
    avatarUrl: { type: String },
    isVerified: { type: Boolean, required: true, default: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);