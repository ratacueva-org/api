import { z } from "zod";

// Profile management
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

// Adresses
export const addressSchema = z.object({
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "El código postal debe tener exactamente 5 dígitos."),
  street: z
    .string()
    .trim()
    .min(2, "La calle debe tener al menos 2 caracteres.")
    .max(255, "La calle no puede exceder 255 caracteres."),
  externalNumber: z
    .string()
    .trim()
    .max(20, "El número exterior no puede exceder 20 caracteres.")
    .optional(),
  internalNumber: z
    .string()
    .trim()
    .max(20, "El número interior no puede exceder 20 caracteres.")
    .optional(),
  neighborhood: z
    .string()
    .trim()
    .min(2, "La colonia debe tener al menos 2 caracteres.")
    .max(255, "La colonia no puede exceder 255 caracteres."),
  city: z
    .string()
    .trim()
    .min(2, "La ciudad debe tener al menos 2 caracteres.")
    .max(100, "La ciudad no puede exceder 100 caracteres."),
  state: z
    .string()
    .trim()
    .min(2, "El estado debe tener al menos 2 caracteres.")
    .max(100, "El estado no puede exceder 100 caracteres."),
  country: z
    .string()
    .trim()
    .min(2, "El país debe tener al menos 2 caracteres.")
    .max(100, "El país no puede exceder 100 caracteres."),
  isDefault: z.boolean().optional(),
});

// Payment methods
export const paymentMethodSchema = z.object({
  type: z.enum(["credit_card", "debit_card", "paypal", "oxxo_cash"], {
    errorMap: () => ({ message: "Selecciona un método de pago válido." }),
  }),
  last4: z
    .string()
    .trim()
    .length(4, "Los últimos 4 dígitos deben tener exactamente 4 caracteres.")
    .regex(/^\d{4}$/, "Los últimos 4 dígitos deben ser numéricos.")
    .optional(),
  provider: z
    .string()
    .trim()
    .max(50, "El nombre del proveedor no puede exceder 50 caracteres.")
    .optional(),
  expiration: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "La expiración debe tener el formato MM/YY.")
    .optional(),
});