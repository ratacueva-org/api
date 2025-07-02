import { Response } from "express";
import { AuthenticatedRequest } from "../../core/middlewares/auth.middleware";
import * as favoritesService from "./favorites.service";

// Obtener productos favoritos del usuario actual
export const getFavorites = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user!.id;
  const favorites = await favoritesService.getFavorites(userId);
  res.json(favorites);
};

// Agregar un producto a favoritos
export const addFavorite = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { productId } = req.params;

  await favoritesService.addFavorite(userId, productId);
  res.status(200).json({ message: "Producto agregado a favoritos" });
};

// Eliminar un producto de favoritos
export const removeFavorite = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user!.id;
  const { productId } = req.params;

  await favoritesService.removeFavorite(userId, productId);
  res.status(200).json({ message: "Producto eliminado de favoritos" });
};