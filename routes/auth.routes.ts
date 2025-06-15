import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema } from "../validations/auth.schema";
import { RequestHandler } from "express";

const router = Router();

router.post("/register", validate(registerSchema) as RequestHandler, authController.register);
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

//  Verificación de cuenta por token (GET con query)
router.get("/verify", authController.verifyEmail);

// Reactivación de cuenta eliminada por token (GET con query)
router.get("/reactivate", authController.reactivateAccount);

// Recuperar contraseña
router.post("/forgot-password", authController.forgotPassword);

// Restablecer contraseña (requiere token y nueva contraseña en body)
router.post("/reset-password", authController.resetPassword);

export default router;