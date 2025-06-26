import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../core/middlewares/auth.middleware";
import { BadRequestError } from "../../core/errors/custom-errors";
import * as userService from "../../modules/users/user.service";

// Profile management
export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  const user = await userService.getProfileById(req.user!.id);
  res.json(user);
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  const updatedUser = await userService.updateProfileById(req.user!.id, req.body);
  res.json({ message: "Perfil actualizado correctamente", user: updatedUser });
};

export const changePassword = async (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  await userService.changePassword(req.user!.id, currentPassword, newPassword);
  res.json({ message: "Contraseña actualizada correctamente" });
};

export const deleteAccount = async (req: AuthenticatedRequest, res: Response) => {
  await userService.softDeleteUser(req.user!.id);
  res.json({ message: "Cuenta eliminada correctamente" });
};

// Address management
export const getAddresses = async (req: AuthenticatedRequest, res: Response) => {
  const addresses = await userService.getAddresses(req.user!.id);
  res.json(addresses);
};

export const addAddress = async (req: AuthenticatedRequest, res: Response) => {
  const addresses = await userService.addAddress(req.user!.id, req.body);
  res.status(201).json({ message: "Dirección agregada", addresses });
};

export const updateAddress = async (req: AuthenticatedRequest, res: Response) => {
  const address = await userService.updateAddress(req.user!.id, req.params.id, req.body);
  res.json({ message: "Dirección actualizada", address });
};

export const deleteAddress = async (req: AuthenticatedRequest, res: Response) => {
  await userService.deleteAddress(req.user!.id, req.params.id);
  res.json({ message: "Dirección eliminada" });
};

export const setDefaultAddress = async (req: AuthenticatedRequest, res: Response) => {
  const address = await userService.setDefaultAddress(req.user!.id, req.params.id);
  res.json({ message: "Dirección predeterminada actualizada", address });
};

// Payment methods management
export const getPaymentMethods = async (req: AuthenticatedRequest, res: Response) => {
  const methods = await userService.getPaymentMethods(req.user!.id);
  res.json(methods);
};

export const addPaymentMethod = async (req: AuthenticatedRequest, res: Response) => {
  const methods = await userService.addPaymentMethod(req.user!.id, req.body);
  res.status(201).json({ message: "Método de pago agregado", methods });
};

export const updatePaymentMethod = async (req: AuthenticatedRequest, res: Response) => {
  const method = await userService.updatePaymentMethod(req.user!.id, req.params.id, req.body);
  res.json({ message: "Método de pago actualizado", method });
};

export const deletePaymentMethod = async (req: AuthenticatedRequest, res: Response) => {
  await userService.deletePaymentMethod(req.user!.id, req.params.id);
  res.json({ message: "Método de pago eliminado" });
};

export const updateProfilePicture = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) throw new BadRequestError("Archivo no recibido.");

  const userId = req.user!.id;
  const imageUrl = await userService.updateProfilePicture(userId, req.file.buffer, req.file.originalname);

  res.json({
    message: "Foto de perfil actualizada correctamente",
    avatarUrl: imageUrl,
  });
};
