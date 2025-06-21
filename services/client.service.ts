import User from "../models/user.model";
import { NotFoundError, UnauthorizedError } from "../errors/custom-errors";

export const getProfileById = async (id: string) => {
  const user = await User.findById(id).select("-password");
  if (!user) throw new NotFoundError("Usuario no encontrado");
  return user;
};

export const updateProfileById = async (
  id: string,
  data: { name?: string; lastName?: string; secondLastName?: string; phone?: string }
) => {
  const user = await User.findById(id);
  if (!user) throw new NotFoundError("Usuario no encontrado");

  Object.assign(user, data);
  await user.save();
  return user;
};

export const changePassword = async (id: string, currentPassword: string, newPassword: string) => {
  const user = await User.findById(id);
  if (!user) throw new NotFoundError("Usuario no encontrado");

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new UnauthorizedError("La contraseña actual es incorrecta");

  user.password = newPassword;
  await user.save();
};

export const softDeleteUser = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw new NotFoundError("Usuario no encontrado");

  if (user.isDeleted) {
    throw new UnauthorizedError("Esta cuenta ya ha sido eliminada.");
  }

  user.isDeleted = true;
  await user.save();
};