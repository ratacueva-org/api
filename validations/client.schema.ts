import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(100, "El nombre no puede exceder 100 caracteres.")
    .optional(),
  lastName: z
    .string()
    .trim()
    .min(2, "El apellido paterno debe tener al menos 2 caracteres.")
    .max(100, "El apellido paterno no puede exceder 100 caracteres.")
    .optional(),
  secondLastName: z
    .string()
    .trim()
    .min(2, "El apellido materno debe tener al menos 2 caracteres.")
    .max(100, "El apellido materno no puede exceder 100 caracteres.")
    .optional(),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "El número de teléfono debe tener exactamente 10 dígitos.")
    .optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .trim()
    .min(8, "La contraseña actual debe tener al menos 8 caracteres."),
  newPassword: z
    .string()
    .trim()
    .min(8, "La nueva contraseña debe tener al menos 8 caracteres.")
    .max(100, "La nueva contraseña no puede exceder 100 caracteres.")
    .regex(/[a-z]/, "La nueva contraseña debe contener al menos una letra minúscula.")
    .regex(/[A-Z]/, "La nueva contraseña debe contener al menos una letra mayúscula.")
    .regex(/[0-9]/, "La nueva contraseña debe contener al menos un número.")
    .regex(/[^a-zA-Z0-9]/, "La nueva contraseña debe contener al menos un carácter especial."),
});