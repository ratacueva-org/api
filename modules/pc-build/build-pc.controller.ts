import { Response } from "express";
import { AuthenticatedRequest } from "../../core/middlewares/auth.middleware";
import { addBuildPcToCart } from "./build-pc.service";
import { addBuildPcSchema } from "./build-pc.schema";
import { AddBuildPcInput } from "./build-pc.model";

export const addBuildPc = async (req: AuthenticatedRequest, res: Response) => {
  const parseResult = addBuildPcSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ errors: parseResult.error.errors });
    return;
  }

  const input: AddBuildPcInput = parseResult.data;

  try {
    await addBuildPcToCart(req.user!.id, input);
    res.status(201).json({ message: "Build agregada al carrito correctamente." });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
