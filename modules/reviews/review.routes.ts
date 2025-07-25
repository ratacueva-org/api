import { Router } from "express";
import * as reviewController from "./review.controller";
import { authenticate } from "../../core/middlewares/auth.middleware";
import { authorize } from "../../core/middlewares/role.middleware";
import { uploadMedia } from "../../core/middlewares/upload-media.middleware";
import { validate } from "../../core/middlewares/validate.middleware";
import {
  CreateReviewSchema,
  ReviewSchema,
} from "../../modules/reviews/review.scheme";

const router = Router();

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all reviews with filtering options
 *     description: Retrieves a list of product reviews with optional filtering by product, rating, and pagination support.
 *     tags: [Reviews]
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
 *         description: Number of reviews per page
 *       - in: query
 *         name: product
 *         schema:
 *           type: string
 *         description: Filter reviews by product ID
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *           minimum: 0.5
 *           maximum: 5
 *         description: Minimum rating filter
 *       - in: query
 *         name: maxRating
 *         schema:
 *           type: number
 *           minimum: 0.5
 *           maximum: 5
 *         description: Maximum rating filter
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: ["rating", "createdAt", "updatedAt"]
 *           default: "createdAt"
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
 *         description: List of reviews with pagination info
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
 *                     $ref: '#/components/schemas/Review'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                     totalReviews:
 *                       type: integer
 *                       example: 45
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.get("/", reviewController.getAllReviews);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get a single review by ID
 *     description: Retrieves detailed information about a specific review including user information and media attachments.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *         example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *     responses:
 *       200:
 *         description: Review details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       400:
 *         description: Invalid review ID format
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
 *                   example: "Invalid review ID format"
 */
router.get("/:id", reviewController.getReviewById);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new product review
 *     description: Creates a new review for a product. Only authenticated clients can create reviews. Supports uploading images and videos with the review.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - product
 *               - rating
 *             properties:
 *               product:
 *                 type: string
 *                 description: Product ID to review
 *                 example: "64f8a1b2c3d4e5f6a7b8c9d1"
 *               rating:
 *                 type: number
 *                 minimum: 0.5
 *                 maximum: 5
 *                 multipleOf: 0.5
 *                 description: Product rating from 0.5 to 5 in increments of 0.5
 *                 example: 4.5
 *               text:
 *                 type: string
 *                 maxLength: 1000
 *                 description: Review text content (optional)
 *                 example: "Great product! Works perfectly and arrived quickly."
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Review images (optional)
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Review videos (optional)
 *     responses:
 *       201:
 *         description: Review created successfully
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
 *                   example: "Review created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       409:
 *         description: User already reviewed this product
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
 *                   example: "You have already reviewed this product"
 */
router.post(
  "/",
  authenticate,
  authorize("client"),
  uploadMedia, // imagenes y/o videos
  validate(CreateReviewSchema),
  reviewController.createReview
);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update an existing review
 *     description: Updates an existing review. Only the client who created the review can update it. Supports updating images and videos.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID to update
 *         example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - product
 *               - rating
 *             properties:
 *               product:
 *                 type: string
 *                 description: Product ID this review belongs to
 *                 example: "64f8a1b2c3d4e5f6a7b8c9d1"
 *               rating:
 *                 type: number
 *                 minimum: 0.5
 *                 maximum: 5
 *                 multipleOf: 0.5
 *                 description: Updated product rating
 *                 example: 4.0
 *               text:
 *                 type: string
 *                 maxLength: 1000
 *                 description: Updated review text content
 *                 example: "Updated review: Still a great product!"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Updated review images (optional)
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Updated review videos (optional)
 *     responses:
 *       200:
 *         description: Review updated successfully
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
 *                   example: "Review updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Not authorized to update this review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden"
 *                 message:
 *                   type: string
 *                   example: "You can only update your own reviews"
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put(
  "/:id",
  authenticate,
  authorize("client"), // Solo clientes pueden hacer update
  uploadMedia,
  validate(ReviewSchema),
  reviewController.updateReview
);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     description: Deletes a review. Clients can only delete their own reviews, while admins can delete any review.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID to delete
 *         example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *     responses:
 *       200:
 *         description: Review deleted successfully
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
 *                   example: "Review deleted successfully"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Not authorized to delete this review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden"
 *                 message:
 *                   type: string
 *                   example: "You can only delete your own reviews or you must be an admin"
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete(
  "/:id",
  authenticate,
  authorize("client", "admin"), // Clientes o admins
  reviewController.deleteReview
);

export default router;
