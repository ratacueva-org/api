import { Router } from "express";
import * as cartController from "./cart.controller";
import { authenticate } from "../../core/middlewares/auth.middleware";
import { validate } from "../../core/middlewares/validate.middleware";
import { addToCartSchema, updateCartItemSchema } from "./cart.schema";

const router = Router();

// Todas las rutas protegidas por autenticación
router.use(authenticate);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's shopping cart
 *     description: Retrieves the current user's shopping cart with all items, quantities, prices, and cart totals.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shopping cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Cart not found (empty cart)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cart is empty"
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items: {}
 *                       example: []
 *                     totalItems:
 *                       type: integer
 *                       example: 0
 *                     totalPrice:
 *                       type: number
 *                       example: 0
 */
router.get("/", cartController.getCart);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add product to shopping cart
 *     description: Adds a product to the user's shopping cart. If the product already exists in the cart with the same variation, the quantities will be combined.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToCartInput'
 *           example:
 *             productId: "64f8a1b2c3d4e5f6a7b8c9d1"
 *             quantity: 2
 *             selectedVariation: "24GB GDDR6X"
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product added to cart successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Not Found"
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 *       409:
 *         description: Insufficient stock
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Conflict"
 *                 message:
 *                   type: string
 *                   example: "Insufficient stock available"
 */
router.post("/", validate(addToCartSchema), cartController.addItem);

/**
 * @swagger
 * /api/cart/items/{itemId}:
 *   patch:
 *     summary: Update cart item quantity or variation
 *     description: Updates the quantity or selected variation of a specific item in the user's cart. Uses the cart item ID, not the product ID.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart item ID (not product ID)
 *         example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCartItemInput'
 *           example:
 *             quantity: 3
 *             selectedVariation: "32GB GDDR6X"
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cart item updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Cart item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Not Found"
 *                 message:
 *                   type: string
 *                   example: "Cart item not found"
 *       409:
 *         description: Insufficient stock for updated quantity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Conflict"
 *                 message:
 *                   type: string
 *                   example: "Insufficient stock for requested quantity"
 */
router.patch("/items/:itemId", validate(updateCartItemSchema), cartController.updateItem);

/**
 * @swagger
 * /api/cart/items/{itemId}:
 *   delete:
 *     summary: Remove item from cart
 *     description: Removes a specific item from the user's shopping cart using the cart item ID.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart item ID to remove
 *         example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Item removed from cart successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Cart item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Not Found"
 *                 message:
 *                   type: string
 *                   example: "Cart item not found"
 */
router.delete("/items/:itemId", cartController.removeItem);

/**
 * @swagger
 * /api/cart/items:
 *   delete:
 *     summary: Clear all items from cart
 *     description: Removes all items from the user's shopping cart, effectively emptying the cart.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cart cleared successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items: {}
 *                       example: []
 *                     totalItems:
 *                       type: integer
 *                       example: 0
 *                     totalPrice:
 *                       type: number
 *                       example: 0
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete("/items", cartController.clearCart);

/**
 * @swagger
 * /api/cart/sync:
 *   post:
 *     summary: Synchronize cart with client data
 *     description: Synchronizes the user's cart with data from the client side. Used when a user was browsing without being authenticated and then logs in, allowing them to merge their local cart with their server-side cart.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartSyncInput'
 *           example:
 *             items:
 *               - productId: "64f8a1b2c3d4e5f6a7b8c9d1"
 *                 quantity: 2
 *                 selectedVariation: "24GB GDDR6X"
 *               - productId: "64f8a1b2c3d4e5f6a7b8c9d2"
 *                 quantity: 1
 *     responses:
 *       200:
 *         description: Cart synchronized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cart synchronized successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       409:
 *         description: Some products have insufficient stock
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Conflict"
 *                 message:
 *                   type: string
 *                   example: "Some products have insufficient stock"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                       requestedQuantity:
 *                         type: integer
 *                       availableStock:
 *                         type: integer
 */
router.post("/sync", cartController.syncCart);

export default router;