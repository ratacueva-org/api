import { Router } from "express";
import * as reviewController from "./review.controller";
import { authenticate } from "../../core/middlewares/auth.middleware";
import { authorize } from "../../core/middlewares/role.middleware";
import { uploadMedia } from "../../core/middlewares/upload-media.middleware";
import { authorizeReviewOwner } from "../../core/middlewares/authorizeReviewOwner.middleware";
import { validate } from "../../core/middlewares/validate.middleware";
import {
  CreateReviewSchema,
  ReviewSchema,
} from "../../modules/reviews/review.scheme";

const router = Router();

// Rutas públicas
router.get("/", reviewController.getAllReviews);
router.get("/:id", reviewController.getReviewById);

// Crear review (solo clientes autenticados)
router.post(
  "/",
  authenticate,
  authorize("client"),
  uploadMedia, // imagenes y/o videos
  validate(CreateReviewSchema),
  reviewController.createReview
);

// Actualizar review (solo clientes autenticados)
router.put(
  "/:id",
  authenticate,
  authorize("client"), // Solo clientes pueden hacer update
  authorizeReviewOwner, // Solo si es el dueño
  uploadMedia,
  validate(ReviewSchema),
  reviewController.updateReview
);

// Eliminar review (clientes o admins)
router.delete(
  "/:id",
  authenticate,
  authorize("client", "admin"), // Clientes o admins
  authorizeReviewOwner, // Cliente solo si es dueño, admin siempre puede
  reviewController.deleteReview
);

export default router;
