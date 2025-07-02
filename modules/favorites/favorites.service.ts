import User from "../users/user.model";
import mongoose from "mongoose";
import { BadRequestError } from "../../core/errors/custom-errors"; // si ya lo usas en otros servicios

export const getFavorites = async (userId: string) => {
  const user = await User.findById(userId)
    .populate("favorites") // Devuelve los detalles del producto
    .select("favorites");

  return user?.favorites || [];
};

export const addFavorite = async (userId: string, productId: string) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new BadRequestError("ID de producto inválido");
  }

  const user = await User.findById(userId).select("favorites");

  if (!user) throw new BadRequestError("Usuario no encontrado");

  const productObjectId = new mongoose.Types.ObjectId(productId);

  if (user.favorites.includes(productObjectId)) {
    throw new BadRequestError("El producto ya está en favoritos");
  }

  await User.findByIdAndUpdate(userId, {
    $addToSet: { favorites: productId },
  });
};

export const removeFavorite = async (userId: string, productId: string) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new BadRequestError("ID de producto inválido");
  }

  const user = await User.findById(userId).select("favorites");

  if (!user) {
    throw new BadRequestError("Usuario no encontrado");
  }

  const productObjectId = new mongoose.Types.ObjectId(productId);

  const isFavorite = user.favorites.includes(productObjectId);
  if (!isFavorite) {
    throw new BadRequestError("El producto no está en favoritos");
  }

  await User.findByIdAndUpdate(userId, {
    $pull: { favorites: productId },
  });
};
