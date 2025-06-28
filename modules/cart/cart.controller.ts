import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../core/middlewares/auth.middleware";
import * as cartService from "./cart.service";
import { BadRequestError } from "../../core/errors/custom-errors";

// Obtener carrito actual
export const getCart = async (req: AuthenticatedRequest, res: Response) => {
  const cart = await cartService.getCartByUser(req.user!.id);
  res.json(cart);
};

// Agregar producto al carrito
export const addItem = async (req: AuthenticatedRequest, res: Response) => {
  const { productId, quantity, selectedVariation } = req.body;
  const cart = await cartService.addToCart(req.user!.id, productId, quantity, selectedVariation);
  res.status(201).json({ message: "Producto añadido al carrito", cart });
};

// Actualizar ítem del carrito
export const updateItem = async (req: AuthenticatedRequest, res: Response) => {
  const { quantity, selectedVariation } = req.body;
  const { itemId } = req.params;
  const cart = await cartService.updateCartItem(req.user!.id, itemId, { quantity, selectedVariation });
  res.json({ message: "Ítem actualizado", cart });
};

// Eliminar ítem del carrito
export const removeItem = async (req: AuthenticatedRequest, res: Response) => {
  const { itemId } = req.params;
  await cartService.removeFromCart(req.user!.id, itemId);
  res.json({ message: "Producto eliminado del carrito" });
};

// Vaciar carrito
export const clearCart = async (req: AuthenticatedRequest, res: Response) => {
  await cartService.clearCart(req.user!.id);
  res.json({ message: "Carrito vaciado correctamente" });
};

// Sincronizar carrito con el cliente
export const syncCart = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const localItems = req.body.items;
  if (!Array.isArray(localItems)) {
    throw new BadRequestError("El cuerpo de la solicitud debe contener un array de ítems.");
  }
  const cart = await cartService.syncCart(userId, localItems);
  res.json(cart);
};