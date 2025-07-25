/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique product identifier
 *           example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *         name:
 *           type: string
 *           description: Product name
 *           example: "NVIDIA GeForce RTX 4090 Graphics Card"
 *         description:
 *           type: string
 *           description: Detailed product description
 *           example: "High-end graphics card for gaming and professional work"
 *         price:
 *           type: number
 *           description: Product price in MXN
 *           example: 35999.99
 *         stock:
 *           type: integer
 *           description: Available quantity in inventory
 *           example: 5
 *         brand:
 *           type: string
 *           description: Product brand
 *           example: "NVIDIA"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *           description: Array of product image URLs
 *           example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *         videos:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *           description: Array of product video URLs
 *           example: ["https://example.com/video1.mp4"]
 *         section:
 *           type: string
 *           enum: ["Video Games", "Computers", "Consoles", "Components", "Storage & Flash", "Accessories", "Peripherals", "Monitors", "Cables & Adapters", "Power", "Networking", "Services"]
 *           description: Main product section
 *           example: "Components"
 *         category:
 *           type: string
 *           description: Product category within the section
 *           example: "Graphics Cards"
 *         subcategory:
 *           type: string
 *           description: Product subcategory (optional)
 *           example: "High-end GPUs"
 *         specs:
 *           type: object
 *           additionalProperties:
 *             oneOf:
 *               - type: string
 *               - type: number
 *           description: Product specifications
 *           example:
 *             "Memory": "24GB GDDR6X"
 *             "Core Clock": "2520 MHz"
 *             "Memory Interface": "384-bit"
 *         discountPercentage:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Discount percentage
 *           example: 10
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           description: Average product rating
 *           example: 4.5
 *         reviewCount:
 *           type: integer
 *           description: Number of reviews
 *           example: 128
 *         isFeatured:
 *           type: boolean
 *           description: Whether the product is featured
 *           example: true
 *         isNewProduct:
 *           type: boolean
 *           description: Whether the product is marked as new
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Product creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Product last update date
 *     CreateProductInput:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - stock
 *         - section
 *         - category
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 255
 *           description: Product name
 *           example: "NVIDIA GeForce RTX 4090 Graphics Card"
 *         description:
 *           type: string
 *           minLength: 10
 *           maxLength: 5000
 *           description: Detailed product description
 *           example: "High-end graphics card for gaming and professional work with 24GB GDDR6X memory"
 *         price:
 *           type: number
 *           minimum: 0
 *           description: Product price in MXN
 *           example: 35999.99
 *         stock:
 *           type: integer
 *           minimum: 0
 *           description: Available quantity in inventory
 *           example: 5
 *         brand:
 *           type: string
 *           maxLength: 100
 *           description: Product brand
 *           example: "NVIDIA"
 *         section:
 *           type: string
 *           enum: ["Video Games", "Computers", "Consoles", "Components", "Storage & Flash", "Accessories", "Peripherals", "Monitors", "Cables & Adapters", "Power", "Networking", "Services"]
 *           description: Main product section
 *           example: "Components"
 *         category:
 *           type: string
 *           description: Product category within the section
 *           example: "Graphics Cards"
 *         subcategory:
 *           type: string
 *           description: Product subcategory (optional)
 *           example: "High-end GPUs"
 *         specs:
 *           type: object
 *           additionalProperties:
 *             oneOf:
 *               - type: string
 *               - type: number
 *           description: Product specifications
 *           example:
 *             "Memory": "24GB GDDR6X"
 *             "Core Clock": "2520 MHz"
 *             "Memory Interface": "384-bit"
 *         discountPercentage:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Discount percentage
 *           example: 10
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           description: Average product rating
 *           example: 4.5
 *         isFeatured:
 *           type: boolean
 *           description: Whether the product is featured
 *           example: true
 *         isNew:
 *           type: boolean
 *           description: Whether the product is marked as new
 *           example: false
 *     UpdateProductInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 255
 *         description:
 *           type: string
 *           minLength: 10
 *           maxLength: 5000
 *         price:
 *           type: number
 *           minimum: 0
 *         stock:
 *           type: integer
 *           minimum: 0
 *         brand:
 *           type: string
 *           maxLength: 100
 *         section:
 *           type: string
 *           enum: ["Video Games", "Computers", "Consoles", "Components", "Storage & Flash", "Accessories", "Peripherals", "Monitors", "Cables & Adapters", "Power", "Networking", "Services"]
 *         category:
 *           type: string
 *         subcategory:
 *           type: string
 *         specs:
 *           type: object
 *           additionalProperties:
 *             oneOf:
 *               - type: string
 *               - type: number
 *         discountPercentage:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *         isFeatured:
 *           type: boolean
 *         isNew:
 *           type: boolean
 *     UpdateStockInput:
 *       type: object
 *       required:
 *         - stock
 *       properties:
 *         stock:
 *           type: integer
 *           minimum: 0
 *           description: New stock quantity
 *           example: 10
 *     UpdateDiscountInput:
 *       type: object
 *       required:
 *         - discountPercentage
 *       properties:
 *         discountPercentage:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Discount percentage to apply
 *           example: 15
 *     UpdateIsFeaturedInput:
 *       type: object
 *       required:
 *         - isFeatured
 *       properties:
 *         isFeatured:
 *           type: boolean
 *           description: Whether the product should be featured
 *           example: true
 *     UpdateIsNewInput:
 *       type: object
 *       required:
 *         - isNew
 *       properties:
 *         isNew:
 *           type: boolean
 *           description: Whether the product should be marked as new
 *           example: false
 */

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

  // Coerce para campos opcionales
  discountPercentage: z.coerce
    .number()
    .min(0, "El descuento no puede ser negativo.")
    .max(100, "El descuento no puede ser mayor a 100.")
    .optional(),

  rating: z.coerce.number().min(0).max(5).optional(),

  isFeatured: z.coerce.boolean().optional(),
  isNew: z.coerce.boolean().optional(),
});

// Schema para crear producto (sin campos obligatorios del servidor como _id)
export const createProductSchema = productSchema.omit({ images: true }); // Las imágenes se manejan aparte con multer

// Schema para actualización general (todos los campos opcionales)
export const updateProductSchema = productSchema.partial();

// Schemas específicos de actualización
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
