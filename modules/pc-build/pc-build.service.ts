import * as cartService from "../cart/cart.service";
import { BadRequestError } from "../../core/errors/custom-errors";

export interface PcBuildProduct {
  productId: string;
  quantity?: number; // opcional, por default 1
}

export interface AddPcBuildInput {
  products: PcBuildProduct[];
}

export const addPcBuildToCart = async (userId: string, input: AddPcBuildInput) => {
  const { products } = input;

  if (!products || products.length === 0) {
    throw new BadRequestError("Debes seleccionar al menos un producto para la build.");
  }

  // Aquí puedes validar que existan productos mínimos según tu lógica de build

  for (const item of products) {
    const quantity = item.quantity ?? 1;
    await cartService.addToCart(userId, item.productId, quantity);
  }
};
