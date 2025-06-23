import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export type Role = "client" | "employee" | "admin";

export interface Address {
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

export interface PaymentMethod {
  type: "credit_card" | "debit_card" | "paypal" | "oxxo_cash";
  last4?: string;
  provider?: string;
  expiration?: string; // MM/YY
}

export interface IUser extends Document {
  _id: string | mongoose.Types.ObjectId; 
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
  isDeleted: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
  lastLoginAt: Date
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

// MongoDB schemas for Address and PaymentMethod
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
    isDeleted: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    passwordResetToken: { type: String },
    passwordResetTokenExpires: { type: Date },
    lastLoginAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (candidate: string) {
  return await bcrypt.compare(candidate, this.password);
};


export default mongoose.model<IUser>("User", UserSchema);