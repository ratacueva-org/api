import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../core/middlewares/auth.middleware";
import { addPcBuildToCart, AddPcBuildInput } from "./pc-build.service";
import { z } from "zod";

const addPcBuildSchema = z.object({
  products: z.array(
    z.object({
      productId: z.string().min(1, "El productId es obligatorio"),
      quantity: z.number().int().positive().optional(),
    })
  ).min(1, "Debes agregar al menos un producto"),
});

export const addPcBuild = async (req: AuthenticatedRequest, res: Response) => {
  const parseResult = addPcBuildSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.errors });
  }

  const input: AddPcBuildInput = parseResult.data;

  try {
    await addPcBuildToCart(req.user!.id, input);
    res.status(201).json({ message: "Build agregada al carrito correctamente." });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
