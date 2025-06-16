import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

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
};