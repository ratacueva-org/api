import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../core/middlewares/auth.middleware";
import { addBuildPcToCart, AddBuildPcInput } from "./build-pc.service";
import { z } from "zod";

const addBuildPcSchema = z.object({
  products: z
    .array(
      z.object({
        productId: z.string().min(1, "El productId es obligatorio"),
        quantity: z.number().int().positive().optional(),
      })
    )
    .min(1, "Debes agregar al menos un producto"),
});

export const addBuildPc = async (req: AuthenticatedRequest, res: Response) => {
  const parseResult = addBuildPcSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ errors: parseResult.error.errors });
    return;
  }

  const input: AddBuildPcInput = parseResult.data;

  try {
    await addBuildPcToCart(req.user!.id, input);
    res
      .status(201)
      .json({ message: "Build agregada al carrito correctamente." });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
