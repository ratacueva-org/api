import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware";
import { ForbiddenError } from "../errors/custom-errors";

export const authorize =
  (...allowedRoles: ("client" | "employee" | "admin")[]) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new ForbiddenError("No tienes permisos para acceder a esta ruta.");
    }

    next();
  };