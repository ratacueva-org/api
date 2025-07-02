import { z } from "zod";

export const addBuildPcSchema = z.object({
  products: z
    .array(
      z.object({
        productId: z.string().min(1, "El productId es obligatorio"),
        quantity: z.number().int().positive().optional(),
      })
    )
    .min(1, "Debes agregar al menos un producto"),
});
