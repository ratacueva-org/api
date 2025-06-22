import { Request, Response } from "express";
import * as authService from "../auth/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({ message: "Registro exitoso. Revisa tu correo.", user });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { user, token } = await authService.loginUser(req.body);
    res.status(200).json({ message: "Inicio de sesión exitoso", user, token });
  } catch (error: any) {
    res.status(error.statusCode || 401).json({ message: error.message });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const result = await authService.verifyEmail(req.query.token as string);
    res.status(200).json({ message: result });
  } catch (error: any) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const message = await authService.forgotPassword(req.body.email);
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(error.statusCode || 404).json({ message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    const message = await authService.resetPassword(token, newPassword);
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

export const reactivateAccount = async (req: Request, res: Response) => {
  try {
    const result = await authService.reactivateAccount(req.query.token as string);
    res.status(200).json({ message: result });
  } catch (error: any) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};