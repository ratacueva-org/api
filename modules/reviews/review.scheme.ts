import { z } from "zod";
import mongoose from "mongoose";

const objectId = z
  .string()
  .refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "ID inválido",
  });

export const CreateReviewSchema = z.object({
  product: objectId,
  rating: z.coerce
    .number()
    .refine(
      (val) => val >= 0.5 && val <= 5 && val * 2 === Math.floor(val * 2),
      {
        message: "El rating debe estar entre 0.5 y 5, en incrementos de 0.5",
      }
    ),
  text: z.string().max(1000).optional(),
  images: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
});

export const ReviewSchema = CreateReviewSchema.extend({
  user: objectId, // asignado backend
  userName: z.string().min(1).max(100), // asignado backend
});
