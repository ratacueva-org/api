/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique review identifier
 *           example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *         product:
 *           type: string
 *           description: Product ID this review belongs to
 *           example: "64f8a1b2c3d4e5f6a7b8c9d1"
 *         user:
 *           type: string
 *           description: User ID who created the review
 *           example: "64f8a1b2c3d4e5f6a7b8c9d2"
 *         userName:
 *           type: string
 *           description: Name of the user who created the review
 *           example: "John Doe"
 *         rating:
 *           type: number
 *           minimum: 0.5
 *           maximum: 5
 *           multipleOf: 0.5
 *           description: Product rating from 0.5 to 5 in increments of 0.5
 *           example: 4.5
 *         text:
 *           type: string
 *           maxLength: 1000
 *           description: Review text content (optional)
 *           example: "Great product! Works perfectly and arrived quickly."
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *           description: Array of review image URLs
 *           example: ["https://example.com/review-image1.jpg"]
 *         videos:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *           description: Array of review video URLs
 *           example: ["https://example.com/review-video1.mp4"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Review creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Review last update date
 *     CreateReviewInput:
 *       type: object
 *       required:
 *         - product
 *         - rating
 *       properties:
 *         product:
 *           type: string
 *           description: Product ID to review
 *           example: "64f8a1b2c3d4e5f6a7b8c9d1"
 *         rating:
 *           type: number
 *           minimum: 0.5
 *           maximum: 5
 *           multipleOf: 0.5
 *           description: Product rating from 0.5 to 5 in increments of 0.5
 *           example: 4.5
 *         text:
 *           type: string
 *           maxLength: 1000
 *           description: Review text content (optional)
 *           example: "Great product! Works perfectly and arrived quickly."
 *     UpdateReviewInput:
 *       type: object
 *       required:
 *         - product
 *         - rating
 *       properties:
 *         product:
 *           type: string
 *           description: Product ID to review
 *           example: "64f8a1b2c3d4e5f6a7b8c9d1"
 *         rating:
 *           type: number
 *           minimum: 0.5
 *           maximum: 5
 *           multipleOf: 0.5
 *           description: Product rating from 0.5 to 5 in increments of 0.5
 *           example: 4.5
 *         text:
 *           type: string
 *           maxLength: 1000
 *           description: Review text content (optional)
 *           example: "Updated review text"
 */

import { z } from "zod";
import mongoose from "mongoose";

const objectId = z
  .string()
  .refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "ID inválido",
  });

export const CreateReviewSchema = z.object({
  product: objectId,
  rating: z.coerce
    .number()
    .refine(
      (val) => val >= 0.5 && val <= 5 && val * 2 === Math.floor(val * 2),
      {
        message: "El rating debe estar entre 0.5 y 5, en incrementos de 0.5",
      }
    ),
  text: z.string().max(1000).optional(),
  images: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
});

export const ReviewSchema = CreateReviewSchema.extend({
  user: objectId, // asignado backend
  userName: z.string().min(1).max(100), // asignado backend
});
