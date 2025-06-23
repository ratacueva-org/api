import { Router } from "express";
import * as authController from "../auth/auth.controller";
import { validate } from "../../core/middlewares/validate.middleware";
import { registerSchema, loginSchema, resetPasswordSchema } from "./auth.schema";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

//  Verificación de cuenta por token (GET con query)
router.get("/verify", authController.verifyEmail);

// Recuperar contraseña
router.post("/forgot-password", authController.forgotPassword);

// Restablecer contraseña (requiere token y nueva contraseña en body)
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);

// Reactivación de cuenta eliminada por token (GET con query)
router.get("/reactivate", authController.reactivateAccount);

export default router;