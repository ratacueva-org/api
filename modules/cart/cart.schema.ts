/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique cart item identifier
 *           example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *         productId:
 *           type: string
 *           description: Product ID in the cart
 *           example: "64f8a1b2c3d4e5f6a7b8c9d1"
 *         productName:
 *           type: string
 *           description: Product name (populated from product)
 *           example: "NVIDIA GeForce RTX 4090"
 *         productImage:
 *           type: string
 *           format: uri
 *           description: Product main image URL
 *           example: "https://example.com/product-image.jpg"
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           description: Quantity of the product in cart
 *           example: 2
 *         unitPrice:
 *           type: number
 *           description: Unit price of the product
 *           example: 35999.99
 *         totalPrice:
 *           type: number
 *           description: Total price for this cart item (unitPrice * quantity)
 *           example: 71999.98
 *         selectedVariation:
 *           type: string
 *           description: Selected product variation (optional)
 *           example: "24GB GDDR6X"
 *         addedAt:
 *           type: string
 *           format: date-time
 *           description: When the item was added to cart
 *     Cart:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique cart identifier
 *           example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *         userId:
 *           type: string
 *           description: User ID who owns the cart
 *           example: "64f8a1b2c3d4e5f6a7b8c9d2"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *           description: Array of cart items
 *         totalItems:
 *           type: integer
 *           description: Total number of items in cart
 *           example: 3
 *         totalPrice:
 *           type: number
 *           description: Total price of all items in cart
 *           example: 85999.97
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Cart creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Cart last update date
 *     AddToCartInput:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: string
 *           description: Product ID to add to cart
 *           example: "64f8a1b2c3d4e5f6a7b8c9d1"
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           description: Quantity to add to cart
 *           example: 2
 *         selectedVariation:
 *           type: string
 *           maxLength: 100
 *           description: Selected product variation (optional)
 *           example: "24GB GDDR6X"
 *     UpdateCartItemInput:
 *       type: object
 *       required:
 *         - quantity
 *       properties:
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           description: New quantity for the cart item
 *           example: 3
 *         selectedVariation:
 *           type: string
 *           maxLength: 100
 *           description: Updated product variation (optional)
 *           example: "32GB GDDR6X"
 *     CartSyncInput:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: Product ID
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 100
 *               selectedVariation:
 *                 type: string
 *                 maxLength: 100
 *           description: Array of cart items to sync from client
 */

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
