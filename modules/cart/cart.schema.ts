import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z.string().refine(
  (val) => mongoose.Types.ObjectId.isValid(val),
  {
    message: "ID de MongoDB inválido",
  }
);

export const addToCartSchema = z.object({
  productId: objectIdSchema,
  quantity: z
    .number({
      required_error: "La cantidad es obligatoria",
      invalid_type_error: "La cantidad debe ser un número",
    })
    .int("La cantidad debe ser un número entero")
    .positive("La cantidad debe ser mayor a 0")
    .max(100, "La cantidad máxima permitida es 100"),
  selectedVariation: z
    .string()
    .min(1, "La variación seleccionada no puede estar vacía")
    .max(100, "La variación seleccionada no puede exceder 100 caracteres")
    .optional(),
});

export const updateCartItemSchema = z.object({
  quantity: z
    .number({
      required_error: "La cantidad es obligatoria",
      invalid_type_error: "La cantidad debe ser un número",
    })
    .int("La cantidad debe ser un número entero")
    .positive("La cantidad debe ser mayor a 0")
    .max(100, "La cantidad máxima permitida es 100"),
  selectedVariation: z
    .string()
    .min(1, "La variación seleccionada no puede estar vacía")
    .max(100, "La variación seleccionada no puede exceder 100 caracteres")
    .optional(),
});

// export const cartItemIdParamSchema = z.object({
//   id: objectIdSchema, // itemId
// });
