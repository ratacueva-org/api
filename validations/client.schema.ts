import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  lastName: z.string().trim().min(2).max(100).optional(),
  secondLastName: z.string().trim().min(2).max(100).optional(),
  phone: z.string().trim().regex(/^\d{10}$/, "Número inválido").optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().trim().min(8),
  newPassword: z
    .string()
    .trim()
    .min(8)
    .max(100)
    .regex(/[a-z]/, "Debe tener minúscula")
    .regex(/[A-Z]/, "Debe tener mayúscula")
    .regex(/[0-9]/, "Debe tener número")
    .regex(/[^a-zA-Z0-9]/, "Debe tener carácter especial"),
});
