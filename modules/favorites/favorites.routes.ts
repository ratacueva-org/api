/**
 * @swagger
 * components:
 *   schemas:
 *     Favorite:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique favorite identifier
 *           example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *         userId:
 *           type: string
 *           description: User ID who favorited the product
 *           example: "64f8a1b2c3d4e5f6a7b8c9d2"
 *         productId:
 *           type: string
 *           description: Product ID that was favorited
 *           example: "64f8a1b2c3d4e5f6a7b8c9d1"
 *         product:
 *           $ref: '#/components/schemas/Product'
 *         addedAt:
 *           type: string
 *           format: date-time
 *           description: When the product was added to favorites
 *     FavoritesList:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User's favorites list ID
 *           example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *         userId:
 *           type: string
 *           description: User ID who owns the favorites list
 *           example: "64f8a1b2c3d4e5f6a7b8c9d2"
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *           description: Array of favorite products with full product details
 *         totalFavorites:
 *           type: integer
 *           description: Total number of favorite products
 *           example: 5
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the favorites list was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the favorites list was last updated
 */

import { Router } from "express";
import * as favoritesController from "./favorites.controller";
import { authenticate } from "../../core/middlewares/auth.middleware";

const router = Router();

// Todas las rutas están protegidas
router.use(authenticate);

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get user's favorite products
 *     description: Retrieves the current user's list of favorite products with full product details including images, prices, and availability.
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of favorites per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: ["addedAt", "productName", "price"]
 *           default: "addedAt"
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: ["asc", "desc"]
 *           default: "desc"
 *         description: Sort order
 *     responses:
 *       200:
 *         description: User's favorite products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     favorites:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     totalFavorites:
 *                       type: integer
 *                       example: 5
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         totalPages:
 *                           type: integer
 *                           example: 1
 *                         hasNextPage:
 *                           type: boolean
 *                           example: false
 *                         hasPrevPage:
 *                           type: boolean
 *                           example: false
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: No favorites found
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
 *                   example: "No favorite products found"
 *                 data:
 *                   type: object
 *                   properties:
 *                     favorites:
 *                       type: array
 *                       items: {}
 *                       example: []
 *                     totalFavorites:
 *                       type: integer
 *                       example: 0
 */
router.get("/", favoritesController.getFavorites);

/**
 * @swagger
 * /api/favorites/{productId}:
 *   post:
 *     summary: Add product to favorites
 *     description: Adds a product to the user's favorites list. If the product is already in favorites, returns a conflict error.
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to add to favorites
 *         example: "64f8a1b2c3d4e5f6a7b8c9d1"
 *     responses:
 *       201:
 *         description: Product added to favorites successfully
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
 *                   example: "Product added to favorites successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *                     addedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T10:30:00Z"
 *       400:
 *         description: Invalid product ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Bad Request"
 *                 message:
 *                   type: string
 *                   example: "Invalid product ID format"
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
 *         description: Product already in favorites
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
 *                   example: "Product is already in your favorites"
 */
router.post("/:productId", favoritesController.addFavorite);

/**
 * @swagger
 * /api/favorites/{productId}:
 *   delete:
 *     summary: Remove product from favorites
 *     description: Removes a product from the user's favorites list. If the product is not in favorites, returns a not found error.
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to remove from favorites
 *         example: "64f8a1b2c3d4e5f6a7b8c9d1"
 *     responses:
 *       200:
 *         description: Product removed from favorites successfully
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
 *                   example: "Product removed from favorites successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     removedProductId:
 *                       type: string
 *                       example: "64f8a1b2c3d4e5f6a7b8c9d1"
 *                     remainingFavorites:
 *                       type: integer
 *                       example: 4
 *       400:
 *         description: Invalid product ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Bad Request"
 *                 message:
 *                   type: string
 *                   example: "Invalid product ID format"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Product not found in favorites
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
 *                   example: "Product not found in your favorites"
 */
router.delete("/:productId", favoritesController.removeFavorite);

export default router;
