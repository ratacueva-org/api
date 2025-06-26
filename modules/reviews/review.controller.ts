import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../core/middlewares/auth.middleware";
import {
  BadRequestError,
  NotFoundError,
} from "../../core/errors/custom-errors";
import * as reviewService from "./review.service";

// GET una reseña por ID
export const getReviewById = async (req: Request, res: Response) => {
  const review = await reviewService.getReviewById(req.params.id);
  res.json(review);
};

// GET todas las reseñas
export const getAllReviews = async (_req: Request, res: Response) => {
  const reviews = await reviewService.getAllReviews();
  res.json(reviews);
};

// POST nueva reseña
export const createReview = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const filesObj = req.files as
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined;

  const allFiles = [...(filesObj?.images ?? []), ...(filesObj?.videos ?? [])];

  const mediaFiles = allFiles.map((file) => ({
    buffer: file.buffer,
    originalname: file.originalname,
    mimetype: file.mimetype,
  }));

  const user = req.user;
  console.log("Usuario en request:", user);
  if (!user) throw new BadRequestError("Usuario no autenticado");

  const userName = `${user.name} ${user.lastName ?? ""}`.trim();

  const review = await reviewService.createReview(
    {
      ...req.body,
      user: user.id,
      userName,
    },
    mediaFiles
  );

  res.status(201).json({ message: "Reseña creada exitosamente", review });
};

// PUT actualizar reseña
export const updateReview = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const filesObj = req.files as
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined;

  const allFiles = [...(filesObj?.images ?? []), ...(filesObj?.videos ?? [])];

  const mediaFiles =
    allFiles.length > 0
      ? allFiles.map((file) => ({
          buffer: file.buffer,
          originalname: file.originalname,
          mimetype: file.mimetype,
        }))
      : undefined;

  const updatedReview = await reviewService.updateReview(
    req.params.id,
    req.body,
    mediaFiles
  );

  res.json({
    message: "Reseña actualizada exitosamente",
    review: updatedReview,
  });
};

// DELETE eliminar reseña
export const deleteReview = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  await reviewService.deleteReview(req.params.id);
  res.json({ message: "Reseña eliminada exitosamente" });
};
