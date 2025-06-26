import { Response, NextFunction } from "express";
import Review from "../../modules/reviews/review.model";
import { AuthenticatedRequest } from "./auth.middleware";
import { ForbiddenError, NotFoundError } from "../errors/custom-errors";

export const authorizeReviewOwner = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const reviewId = req.params.id;
  const user = req.user!;

  const review = await Review.findById(reviewId);
  if (!review) throw new NotFoundError("Reseña no encontrada.");

  // Si no es dueño ni admin
  if (review.user.toString() !== user.id && user.role !== "admin") {
    throw new ForbiddenError("No tienes permiso para modificar esta reseña.");
  }

  next();
};
