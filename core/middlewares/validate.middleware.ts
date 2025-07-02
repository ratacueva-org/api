import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors/custom-errors";

// Validar req.body
export const validate = (schema: ZodSchema) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
            res.status(400).json({
            message: "Validation failed",
            errors: result.error.flatten().fieldErrors,
        });
        return;
    }
    req.body = result.data; // Validated data
    next();
}

// Middleware para validar req.query
export const validateQuery = (schema: ZodSchema) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    console.error("Zod Query Validation Error:", result.error);
    const errors = result.error.flatten().fieldErrors;
    throw new BadRequestError(`Validation failed (Query): ${JSON.stringify(errors)}`);
  }
  Object.assign(req.query, result.data); 
  next();
};

// Middleware para validar req.params
export const validateParams = (schema: ZodSchema) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    console.error("Zod Params Validation Error:", result.error);
    const errors = result.error.flatten().fieldErrors;
    throw new BadRequestError(`Validation failed (Params): ${JSON.stringify(errors)}`);
  }
  // Opcional: Reemplazar los params con los datos validados
  Object.assign(req.params, result.data);
  next();
};