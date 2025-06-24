import { z } from "zod";

import { SectionValues, CategoryValues, SubCategoryValues } from "./product.model"; // Ajusta la ruta si es necesario

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre del producto debe tener al menos 2 caracteres.")
    .max(255, "El nombre del producto no puede exceder 255 caracteres."),

  description: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres.")
    .max(5000, "La descripción no puede exceder 5000 caracteres."),

  price: z
    .number()
    .min(0, "El precio no puede ser negativo."),

  stock: z
    .number()
    .int("El stock debe ser un número entero.")
    .min(0, "El stock no puede ser negativo."),

  brand: z
    .string()
    .trim()
    .max(100, "La marca no puede exceder 100 caracteres.")
    .optional(),

  images: z
    .array(z.string().url("Debe ser una URL válida."))
    .min(1, "Debe haber al menos una imagen."),

  section: z.enum(Object.values(SectionValues) as [string, ...string[]], {
    errorMap: () => ({ message: "Sección inválida." }),
  }),

  category: z.enum(Object.values(CategoryValues) as [string, ...string[]], {
    errorMap: () => ({ message: "Categoría inválida." }),
  }),

  subcategory: z.enum(Object.values(SubCategoryValues) as [string, ...string[]], {
    errorMap: () => ({ message: "Subcategoría inválida." }),
  }).optional(),

  specs: z
    .record(
      z.union([
        z.string().max(255, "Una especificación no debe exceder 255 caracteres."),
        z.number()
      ])
    )
    .optional(),

  discountPercentage: z
    .number()
    .min(0, "El descuento no puede ser negativo.")
    .max(100, "El descuento no puede ser mayor a 100.")
    .optional(),

  rating: z
    .number()
    .min(0)
    .max(5)
    .optional(),

  isFeatured: z.boolean().optional(),
  isNew: z.boolean().optional(),
});

