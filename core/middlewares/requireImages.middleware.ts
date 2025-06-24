import { Request, Response, NextFunction } from "express";

export const requireImages = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
    res.status(400).json({ message: "Se requieren al menos una imagen." });
    return; // Importante para no seguir con next()
  }
  next();
};
