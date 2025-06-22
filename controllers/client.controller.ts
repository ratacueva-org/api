import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as clientService from "../services/client.service";

// Profile management
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

// Address management
export const getAddresses = async (req: AuthenticatedRequest, res: Response) => {
  const addresses = await clientService.getAddresses(req.user!.id);
  res.json(addresses);
};

export const addAddress = async (req: AuthenticatedRequest, res: Response) => {
  const addresses = await clientService.addAddress(req.user!.id, req.body);
  res.status(201).json({ message: "Dirección agregada", addresses });
};

export const updateAddress = async (req: AuthenticatedRequest, res: Response) => {
  const address = await clientService.updateAddress(req.user!.id, req.params.id, req.body);
  res.json({ message: "Dirección actualizada", address });
};

export const deleteAddress = async (req: AuthenticatedRequest, res: Response) => {
  await clientService.deleteAddress(req.user!.id, req.params.id);
  res.json({ message: "Dirección eliminada" });
};

export const setDefaultAddress = async (req: AuthenticatedRequest, res: Response) => {
  const address = await clientService.setDefaultAddress(req.user!.id, req.params.id);
  res.json({ message: "Dirección predeterminada actualizada", address });
};

// Payment methods management
export const getPaymentMethods = async (req: AuthenticatedRequest, res: Response) => {
  const methods = await clientService.getPaymentMethods(req.user!.id);
  res.json(methods);
};

export const addPaymentMethod = async (req: AuthenticatedRequest, res: Response) => {
  const methods = await clientService.addPaymentMethod(req.user!.id, req.body);
  res.status(201).json({ message: "Método de pago agregado", methods });
};

export const deletePaymentMethod = async (req: AuthenticatedRequest, res: Response) => {
  await clientService.deletePaymentMethod(req.user!.id, req.params.id);
  res.json({ message: "Método de pago eliminado" });
};

// Order history
export const getMyOrders = async (req: AuthenticatedRequest, res: Response) => {
  const orders = await clientService.getMyOrders(req.user!.id);
  res.json(orders);
};

export const getOrderDetails = async (req: AuthenticatedRequest, res: Response) => {
  const order = await clientService.getOrderDetails(req.user!.id, req.params.id);
  res.json(order);
};