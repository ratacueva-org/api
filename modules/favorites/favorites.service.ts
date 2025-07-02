import User from "../users/user.model";
import mongoose from "mongoose";

export const getFavorites = async (userId: string) => {
  const user = await User.findById(userId)
    .populate("favorites") // Opcional, si quieres traer los datos completos del producto
    .select("favorites");

  return user?.favorites || [];
};

export const addFavorite = async (userId: string, productId: string) => {
  if (!mongoose.Types.ObjectId.isValid(productId))
    throw new Error("ID de producto inválido");

  await User.findByIdAndUpdate(userId, {
    $addToSet: { favorites: productId },
  });
};

export const removeFavorite = async (userId: string, productId: string) => {
  await User.findByIdAndUpdate(userId, {
    $pull: { favorites: productId },
  });
};