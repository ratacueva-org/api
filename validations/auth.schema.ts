import { z } from "zod";

export const addressSchema = z.object({
  postalCode: z.string()
    .regex(/^\d{5}$/, "El código postal debe ser de 5 dígitos."),
  street: z.string().min(2, "La calle es requerida y debe tener al menos 2 caracteres.").max(255, "La calle no puede exceder 255 caracteres.").trim(),
  externalNumber: z.string().max(20, "El número exterior no puede exceder 20 caracteres.").optional(),
  internalNumber: z.string().max(20, "El número interior no puede exceder 20 caracteres.").optional(),
  neighborhood: z.string().min(2, "La colonia/barrio es requerida.").max(255, "La colonia/barrio no puede exceder 255 caracteres.").trim(),
  city: z.string().min(2, "La ciudad es requerida y debe tener al menos 2 caracteres.").max(100, "La ciudad no puede exceder 100 caracteres.").trim(),
  state: z.string().min(2, "El estado es requerido y debe tener al menos 2 caracteres.").max(100, "El estado no puede exceder 100 caracteres.").trim(),
  country: z.string().min(2, "El país es requerido y debe tener al menos 2 caracteres.").max(100, "El país no puede exceder 100 caracteres.").trim(),
  isDefault: z.boolean().optional(),
});

export const paymentMethodSchema = z.object({
  type: z.enum(["credit_card", "debit_card", "paypal", "oxxo_cash"], {
    errorMap: (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.invalid_enum_value) {
        return { message: "Tipo de método de pago inválido." };
      }
      return { message: ctx.defaultError };
    }
  }),
  last4: z.string()
    .length(4, "Los últimos 4 dígitos deben tener exactamente 4 caracteres.")
    .regex(/^\d{4}$/, "Los últimos 4 dígitos deben ser numéricos.")
    .optional(),
  provider: z.string().max(50, "El proveedor no puede exceder 50 caracteres.").optional(),
  expiration: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Formato de expiración inválido (MM/YY).")
    .optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres.").max(100, "El nombre no puede exceder 100 caracteres.").trim(),
  lastName: z.string().min(2, "El apellido paterno debe tener al menos 2 caracteres.").max(100, "El apellido paterno no puede exceder 100 caracteres.").trim(),
  secondLastName: z.string().min(2, "El apellido materno debe tener al menos 2 caracteres.").max(100, "El apellido materno no puede exceder 100 caracteres.").trim(),
  
  email: z.string()
    .email("Formato de correo electrónico inválido.")
    .toLowerCase()
    .trim(),

  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .max(100, "La contraseña no puede exceder 100 caracteres.")
    .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula.")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula.")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número.")
    .regex(/[^a-zA-Z0-9\s]/, "La contraseña debe contener al menos un carácter especial.")
    .trim(),

  phone: z.string()
    .regex(/^\d{10}$/, "El número de teléfono debe ser de 10 dígitos.")
    .trim()
    .optional(),

  addresses: z.array(addressSchema).optional(),
  paymentMethods: z.array(paymentMethodSchema).optional(),
});

export const loginSchema = z.object({
  email: z.string()
    .email("Formato de correo electrónico inválido.")
    .toLowerCase()
    .trim(),
  password: z.string().trim(),
});