import { Router } from "express";
import * as clientController from "../controllers/client.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateProfileSchema, changePasswordSchema, addressSchema, paymentMethodSchema } from "../validations/client.schema";

const router = Router();

// Profile management routes
router.get("/me", authenticate, clientController.getProfile);
router.patch("/me", authenticate, validate(updateProfileSchema), clientController.updateProfile);
router.patch("/change-password", authenticate, validate(changePasswordSchema), clientController.changePassword);
router.delete("/delete", authenticate, clientController.deleteAccount);

// Address managements routes
router.get("/addresses", authenticate, clientController.getAddresses);
router.post("/addresses", authenticate, validate(addressSchema), clientController.addAddress);
router.patch("/addresses/:id", authenticate, validate(addressSchema), clientController.updateAddress);
router.delete("/addresses/:id", authenticate, clientController.deleteAddress);
router.patch("/addresses/:id/set-default", authenticate, clientController.setDefaultAddress);

// Payment methods routes
router.get("/payment-methods", authenticate, clientController.getPaymentMethods);
router.post("/payment-methods", authenticate, validate(paymentMethodSchema), clientController.addPaymentMethod);
router.delete("/payment-methods/:id", authenticate, clientController.deletePaymentMethod);

// Order history routes
router.get("/orders", authenticate, clientController.getMyOrders);
router.get("/orders/:id", authenticate, clientController.getOrderDetails);

export default router;