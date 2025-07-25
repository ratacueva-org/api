
/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         postalCode:
 *           type: string
 *         street:
 *           type: string
 *         externalNumber:
 *           type: string
 *         internalNumber:
 *           type: string
 *         neighborhood:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         country:
 *           type: string
 *         isDefault:
 *           type: boolean
 *     PaymentMethod:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [credit_card, debit_card, paypal, oxxo_cash]
 *         last4:
 *           type: string
 *         provider:
 *           type: string
 *         expiration:
 *           type: string
 *     RegisterUserInput:
 *       type: object
 *       required:
 *         - name
 *         - lastName
 *         - secondLastName
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name.
 *         lastName:
 *           type: string
 *           description: The user's last name.
 *         secondLastName:
 *           type: string
 *           description: The user's second last name.
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email.
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password.
 *         phone:
 *           type: string
 *           description: The user's phone number.
 *         addresses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Address'
 *         paymentMethods:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PaymentMethod'
 *     LoginUserInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *     ResetPasswordInput:
 *       type: object
 *       required:
 *         - token
 *         - newPassword
 *       properties:
 *         token:
 *           type: string
 *         newPassword:
 *           type: string
 *           format: password
 */
import { z } from "zod";

export const addressSchema = z.object({
  postalCode: z.string()
    .regex(/^\d{5}$/, "El código postal debe ser de 5 dígitos."),
  street: z.string().trim().min(2, "La calle es requerida y debe tener al menos 2 caracteres.").max(255, "La calle no puede exceder 255 caracteres."),
  externalNumber: z.string().trim().max(20, "El número exterior no puede exceder 20 caracteres.").optional(),
  internalNumber: z.string().trim().max(20, "El número interior no puede exceder 20 caracteres.").optional(),
  neighborhood: z.string().trim().min(2, "La colonia/barrio es requerida.").max(255, "La colonia/barrio no puede exceder 255 caracteres."),
  city: z.string().trim().min(2, "La ciudad es requerida").max(100),
  state: z.string().trim().min(2, "El estado es requerido").max(100),
  country: z.string().trim().min(2, "El país es requerido").max(100),
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
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres.").max(100),
  lastName: z.string().trim().min(2, "El apellido paterno debe tener al menos 2 caracteres.").max(100),
  secondLastName: z.string().trim().min(2, "El apellido materno debe tener al menos 2 caracteres.").max(100),

  email: z.string()
    .trim()
    .email("Formato de correo electrónico inválido.")
    .toLowerCase(),

  password: z.string()
    .trim()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .max(100)
    .regex(/[a-z]/, "Debe contener al menos una minúscula.")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula.")
    .regex(/[0-9]/, "Debe contener al menos un número.")
    .regex(/[^a-zA-Z0-9\s]/, "Debe contener al menos un carácter especial."),

  phone: z.string()
    .trim()
    .regex(/^\d{10}$/, "El número de teléfono debe ser de 10 dígitos.")
    .optional(),

  addresses: z.array(addressSchema).optional(),
  paymentMethods: z.array(paymentMethodSchema).optional(),
});


export const loginSchema = z.object({
  email: z.string().trim().email("Formato de correo electrónico inválido.").toLowerCase(),
  password: z.string().trim(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "El token es requerido."),
  newPassword: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .max(100, "La contraseña no puede exceder 100 caracteres.")
    .regex(/[a-z]/, "Debe contener al menos una letra minúscula.")
    .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula.")
    .regex(/[0-9]/, "Debe contener al menos un número.")
    .regex(/[^a-zA-Z0-9]/, "Debe contener al menos un carácter especial."),
});
