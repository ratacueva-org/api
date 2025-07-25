import { Router } from "express";

import * as productController from "../../modules/products/product.controller";
import { authenticate } from "../../core/middlewares/auth.middleware";
import { authorize } from "../../core/middlewares/role.middleware";
// Importa el middleware específico para imágenes + videos
import { uploadMedia } from "../../core/middlewares/upload-media.middleware";
import { validate } from "../../core/middlewares/validate.middleware";
import {
  createProductSchema,
  updateProductSchema,
  updateStockSchema,
  updateDiscountSchema,
  updateIsFeaturedSchema,
  updateIsNewSchema,
} from "../../modules/products/product.schema";
// Middleware para requerir al menos una imagen en req.files.images
import { requireImages } from "../../core/middlewares/requireImages.middleware";

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with filtering and pagination
 *     description: Retrieves a paginated list of products with optional filtering by section, category, price range, brand, and search terms. Supports sorting and advanced filtering options.
 *     tags: [Products]
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
 *         description: Number of products per page
 *       - in: query
 *         name: section
 *         schema:
 *           type: string
 *           enum: ["Video Games", "Computers", "Consoles", "Components", "Storage & Flash", "Accessories", "Peripherals", "Monitors", "Cables & Adapters", "Power", "Networking", "Services"]
 *         description: Filter by product section
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by product category
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter by product brand
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum price filter
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for product name and description
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: ["name", "price", "rating", "createdAt"]
 *           default: "createdAt"
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: ["asc", "desc"]
 *           default: "desc"
 *         description: Sort order
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         description: Filter by products in stock only
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter by featured products only
 *       - in: query
 *         name: isNew
 *         schema:
 *           type: boolean
 *         description: Filter by new products only
 *     responses:
 *       200:
 *         description: List of products with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     totalProducts:
 *                       type: integer
 *                       example: 95
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.get("/", productController.getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     description: Retrieves detailed information about a specific product including all specifications, images, videos, and related data.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
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
 */
router.get("/:id", productController.getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (Admin/Employee only)
 *     description: Creates a new product in the catalog with images and videos. Only authenticated employees and admins can create products. Requires at least one image.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - stock
 *               - section
 *               - category
 *               - images
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 255
 *                 description: Product name
 *                 example: "NVIDIA GeForce RTX 4090 Graphics Card"
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 5000
 *                 description: Detailed product description
 *                 example: "High-end graphics card for gaming and professional work with 24GB GDDR6X memory"
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 description: Product price in MXN
 *                 example: 35999.99
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 description: Available quantity in inventory
 *                 example: 5
 *               brand:
 *                 type: string
 *                 maxLength: 100
 *                 description: Product brand (optional)
 *                 example: "NVIDIA"
 *               section:
 *                 type: string
 *                 enum: ["Video Games", "Computers", "Consoles", "Components", "Storage & Flash", "Accessories", "Peripherals", "Monitors", "Cables & Adapters", "Power", "Networking", "Services"]
 *                 description: Main product section
 *                 example: "Components"
 *               category:
 *                 type: string
 *                 description: Product category within the section
 *                 example: "Graphics Cards"
 *               subcategory:
 *                 type: string
 *                 description: Product subcategory (optional)
 *                 example: "High-end GPUs"
 *               specs:
 *                 type: string
 *                 description: JSON string of product specifications (optional)
 *                 example: '{"Memory": "24GB GDDR6X", "Core Clock": "2520 MHz"}'
 *               discountPercentage:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Discount percentage (optional)
 *                 example: 10
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *                 description: Initial product rating (optional)
 *                 example: 4.5
 *               isFeatured:
 *                 type: boolean
 *                 description: Whether the product is featured (optional)
 *                 example: true
 *               isNew:
 *                 type: boolean
 *                 description: Whether the product is marked as new (optional)
 *                 example: false
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Product images (at least one required)
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Product videos (optional)
 *     responses:
 *       201:
 *         description: Product created successfully
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
 *                   example: "Product created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post(
  "/",
  authenticate,
  authorize("employee", "admin"),
  uploadMedia, // <-- Aquí usas el middleware con imagen + video
  requireImages,
  validate(createProductSchema),
  productController.addProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product completely (Admin/Employee only)
 *     description: Updates all fields of an existing product. Only authenticated employees and admins can update products. Requires at least one image.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to update
 *         example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 255
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 5000
 *               price:
 *                 type: number
 *                 minimum: 0
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *               brand:
 *                 type: string
 *                 maxLength: 100
 *               section:
 *                 type: string
 *                 enum: ["Video Games", "Computers", "Consoles", "Components", "Storage & Flash", "Accessories", "Peripherals", "Monitors", "Cables & Adapters", "Power", "Networking", "Services"]
 *               category:
 *                 type: string
 *               subcategory:
 *                 type: string
 *               specs:
 *                 type: string
 *                 description: JSON string of product specifications
 *               discountPercentage:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *               isFeatured:
 *                 type: boolean
 *               isNew:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Updated product images
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Updated product videos
 *     responses:
 *       200:
 *         description: Product updated successfully
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
 *                   example: "Product updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put(
  "/:id",
  authenticate,
  authorize("employee", "admin"),
  uploadMedia, // <-- También aquí
  requireImages,
  validate(updateProductSchema),
  productController.updateProduct
);

/**
 * @swagger
 * /api/products/{id}/stock:
 *   patch:
 *     summary: Update product stock quantity (Admin/Employee only)
 *     description: Updates only the stock quantity of a specific product. Useful for inventory management.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStockInput'
 *           example:
 *             stock: 25
 *     responses:
 *       200:
 *         description: Product stock updated successfully
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
 *                   example: "Product stock updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *                     previousStock:
 *                       type: integer
 *                       example: 10
 *                     newStock:
 *                       type: integer
 *                       example: 25
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.patch(
  "/:id/stock",
  authenticate,
  authorize("employee", "admin"),
  validate(updateStockSchema),
  productController.updateStockProduct
);

/**
 * @swagger
 * /api/products/{id}/discount:
 *   patch:
 *     summary: Update product discount percentage (Admin/Employee only)
 *     description: Updates only the discount percentage of a specific product. Useful for sales and promotions.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDiscountInput'
 *           example:
 *             discountPercentage: 20
 *     responses:
 *       200:
 *         description: Product discount updated successfully
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
 *                   example: "Product discount updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *                     previousDiscount:
 *                       type: number
 *                       example: 10
 *                     newDiscount:
 *                       type: number
 *                       example: 20
 *                     originalPrice:
 *                       type: number
 *                       example: 35999.99
 *                     discountedPrice:
 *                       type: number
 *                       example: 28799.99
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.patch(
  "/:id/discount",
  authenticate,
  authorize("employee", "admin"),
  validate(updateDiscountSchema),
  productController.updateDiscountProduct
);

/**
 * @swagger
 * /api/products/{id}/is-featured:
 *   patch:
 *     summary: Update product featured status (Admin/Employee only)
 *     description: Marks or unmarks a product as featured. Featured products are typically shown prominently on the homepage.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateIsFeaturedInput'
 *           example:
 *             isFeatured: true
 *     responses:
 *       200:
 *         description: Product featured status updated successfully
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
 *                   example: "Product featured status updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *                     isFeatured:
 *                       type: boolean
 *                       example: true
 *                     productName:
 *                       type: string
 *                       example: "NVIDIA GeForce RTX 4090"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.patch(
  "/:id/is-featured",
  authenticate,
  authorize("employee", "admin"),
  validate(updateIsFeaturedSchema),
  productController.updateIsFeaturedProduct
);

/**
 * @swagger
 * /api/products/{id}/is-new:
 *   patch:
 *     summary: Update product new status (Admin/Employee only)
 *     description: Marks or unmarks a product as new. New products are typically shown with a "New" badge or in special sections.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateIsNewInput'
 *           example:
 *             isNew: false
 *     responses:
 *       200:
 *         description: Product new status updated successfully
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
 *                   example: "Product new status updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *                     isNew:
 *                       type: boolean
 *                       example: false
 *                     productName:
 *                       type: string
 *                       example: "NVIDIA GeForce RTX 4090"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.patch(
  "/:id/is-new",
  authenticate,
  authorize("employee", "admin"),
  validate(updateIsNewSchema),
  productController.updateIsNewProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product (Admin/Employee only)
 *     description: Permanently deletes a product from the catalog. This action cannot be undone. Only authenticated employees and admins can delete products.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to delete
 *         example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *     responses:
 *       200:
 *         description: Product deleted successfully
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
 *                   example: "Product deleted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     deletedProductId:
 *                       type: string
 *                       example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *                     deletedProductName:
 *                       type: string
 *                       example: "NVIDIA GeForce RTX 4090"
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T10:30:00Z"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       409:
 *         description: Cannot delete product - it has pending orders or dependencies
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
 *                   example: "Cannot delete product as it has pending orders or is part of existing carts"
 *                 details:
 *                   type: object
 *                   properties:
 *                     pendingOrders:
 *                       type: integer
 *                       example: 3
 *                     inCarts:
 *                       type: integer
 *                       example: 5
 */
router.delete(
  "/:id",
  authenticate,
  authorize("employee", "admin"),
  productController.deleteProduct
);

export default router;