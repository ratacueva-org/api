import mongoose, { Schema, Document } from "mongoose";

export const ProcessorTypeValues = {
  INTEL: "Intel",
  AMD: "AMD",
} as const;

export type ProcessorType = (typeof ProcessorTypeValues)[keyof typeof ProcessorTypeValues];

export const AssemblyValues = {
  ASSEMBLED: "Assembled",
  UNASSEMBLED: "Unassembled",
} as const;

export type AssemblyType = (typeof AssemblyValues)[keyof typeof AssemblyValues];

export interface IPcBuild extends Document {
  _id: string | mongoose.Types.ObjectId;
  user: string | mongoose.Types.ObjectId;

  processorType: ProcessorType;
  processor: string | mongoose.Types.ObjectId;

  motherboard: string | mongoose.Types.ObjectId;
  cooler: string | mongoose.Types.ObjectId;

  ram: string | mongoose.Types.ObjectId;
  extraRam?: string | mongoose.Types.ObjectId | null;

  gpu: string | mongoose.Types.ObjectId;

  storage: string | mongoose.Types.ObjectId;
  extraStorage?: string | mongoose.Types.ObjectId | null;

  case: string | mongoose.Types.ObjectId;
  powerSupply: string | mongoose.Types.ObjectId;

  assembly: AssemblyType;

  totalPrice: number;

  createdAt: Date;
  updatedAt: Date;
}

const pcBuildSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    processorType: {
      type: String,
      enum: Object.values(ProcessorTypeValues),
      required: true,
    },
    processor: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    motherboard: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    cooler: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    ram: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    extraRam: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: false,
    },
    gpu: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    storage: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    extraStorage: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: false,
    },
    case: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    powerSupply: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    assembly: {
      type: String,
      enum: Object.values(AssemblyValues),
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPcBuild>("PcBuild", pcBuildSchema);