import { z } from "zod";
import {
  SectionValues,
  CategoryValues,
  SubCategoryValues,
} from "./product.model";

// Schema base para producto completo
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

  // ✅ Tipos coercitivos
  price: z.coerce.number().min(0, "El precio no puede ser negativo."),

  stock: z.coerce
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
  videos: z
    .union([z.string().optional(), z.array(z.string())])
    .transform((val) => {
      if (!val) return [];
      if (typeof val === "string") {
        return val.trim() === "" ? [] : [val];
      }
      return val;
    }),

  section: z.enum(Object.values(SectionValues) as [string, ...string[]], {
    errorMap: () => ({ message: "Sección inválida." }),
  }),

  category: z.enum(Object.values(CategoryValues) as [string, ...string[]], {
    errorMap: () => ({ message: "Categoría inválida." }),
  }),

  subcategory: z
    .enum(Object.values(SubCategoryValues) as [string, ...string[]], {
      errorMap: () => ({ message: "Subcategoría inválida." }),
    })
    .optional(),

  specs: z
    .record(
      z.union([
        z
          .string()
          .max(255, "Una especificación no debe exceder 255 caracteres."),
        z.number(),
      ])
    )
    .optional(),

  // ✅ Coerce para campos opcionales
  discountPercentage: z.coerce
    .number()
    .min(0, "El descuento no puede ser negativo.")
    .max(100, "El descuento no puede ser mayor a 100.")
    .optional(),

  rating: z.coerce.number().min(0).max(5).optional(),

  isFeatured: z.coerce.boolean().optional(),
  isNew: z.coerce.boolean().optional(),
});

// 🎯 Schema para crear producto (sin campos obligatorios del servidor como _id)
export const createProductSchema = productSchema.omit({ images: true }); // Las imágenes se manejan aparte con multer

// ✏️ Schema para actualización general (todos los campos opcionales)
export const updateProductSchema = productSchema.partial();

// 🔧 Schemas específicos de actualización
export const updateStockSchema = z.object({
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo."),
});

export const updateDiscountSchema = z.object({
  discountPercentage: z.coerce
    .number()
    .min(0, "El descuento no puede ser negativo.")
    .max(100, "El descuento no puede ser mayor a 100."),
});

export const updateIsFeaturedSchema = z.object({
  isFeatured: z.coerce.boolean(),
});

export const updateIsNewSchema = z.object({
  isNew: z.coerce.boolean(),
});