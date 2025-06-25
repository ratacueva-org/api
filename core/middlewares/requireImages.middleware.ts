import { Request, Response, NextFunction } from "express";

export const requireImages = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // `req.files` es un objeto { images: [], videos: [] } cuando usas upload.fields()
  const files = req.files as
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined;

  if (!files || !files.images || files.images.length === 0) {
    res
      .status(400)
      .json({ message: "Se requiere al menos una imagen del producto." });
    return;
  }

  next(); // Sigue al siguiente middleware/controlador
};