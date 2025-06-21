import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as clientService from "../services/client.service";

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  const user = await clientService.getProfileById(req.user!.id);
  res.json(user);
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  const updatedUser = await clientService.updateProfileById(req.user!.id, req.body);
  res.json({ message: "Perfil actualizado correctamente", user: updatedUser });
};

export const changePassword = async (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  await clientService.changePassword(req.user!.id, currentPassword, newPassword);
  res.json({ message: "Contraseña actualizada correctamente" });
};

export const deleteAccount = async (req: AuthenticatedRequest, res: Response) => {
  await clientService.softDeleteUser(req.user!.id);
  res.json({ message: "Cuenta eliminada correctamente" });
};
