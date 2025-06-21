import { Router } from "express";
import * as clientController from "../controllers/client.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateProfileSchema, changePasswordSchema } from "../validations/client.schema";

const router = Router();

router.get("/me", authenticate, clientController.getProfile);
router.patch("/me", authenticate, validate(updateProfileSchema), clientController.updateProfile);
router.patch("/change-password", authenticate, validate(changePasswordSchema), clientController.changePassword);
router.delete("/delete", authenticate, clientController.deleteAccount);

export default router;
