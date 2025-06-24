import { Request, Response, NextFunction } from "express";

export const requireImages = (req: Request, res: Response, next: NextFunction) => {
  if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
    return res.status(400).json({ message: "Se requieren al menos una imagen." });
  }
  next();
};
