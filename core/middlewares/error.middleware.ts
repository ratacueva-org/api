import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom-errors";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
 
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
    });
  }

  console.error(err);
  res.status(500).json({
    error: "InternalServerError",
    message: "Ocurrió un error inesperado.",
  });
};