import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  user: mongoose.Types.ObjectId; // referencia al usuario
  userName: string; // nombre visible del usuario (lo almacenamos por si cambia su nombre luego)
  product: mongoose.Types.ObjectId; // referencia al producto
  text?: string;
  images?: string[];
  videos?: string[];
  rating: number; // valores de 0.0 a 5.0
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    text: {
      type: String,
      maxlength: 1000,
    },
    images: [String],
    videos: [String],
    rating: {
      type: Number,
      required: true,
      enum: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IReview>("Review", ReviewSchema);
