import * as cartService from "../cart/cart.service";
import { BadRequestError } from "../../core/errors/custom-errors";
import { AddBuildPcInput } from "./build-pc.model";

export const addBuildPcToCart = async (userId: string, input: AddBuildPcInput) => {
  const { products } = input;

  if (!products || products.length === 0) {
    throw new BadRequestError("Debes seleccionar al menos un producto para la build.");
  }

  for (const item of products) {
    const quantity = item.quantity ?? 1;
    await cartService.addToCart(userId, item.productId, quantity);
  }
};
