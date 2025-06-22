import { Router } from "express";
import * as userController from "../../modules/users/user.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { updateProfileSchema, changePasswordSchema, addressSchema, paymentMethodSchema } from "../../modules/users/user.schema";

const router = Router();

// Profile management routes
router.get("/me", authenticate, userController.getProfile);
router.patch("/me", authenticate, validate(updateProfileSchema), userController.updateProfile);
router.patch("/change-password", authenticate, validate(changePasswordSchema), userController.changePassword);
router.delete("/delete", authenticate, userController.deleteAccount);

// Address managements routes
router.get("/addresses", authenticate, userController.getAddresses);
router.post("/addresses", authenticate, validate(addressSchema), userController.addAddress);
router.patch("/addresses/:id", authenticate, validate(addressSchema), userController.updateAddress);
router.delete("/addresses/:id", authenticate, userController.deleteAddress);
router.patch("/addresses/:id/set-default", authenticate, userController.setDefaultAddress);

// Payment methods routes
router.get("/payment-methods", authenticate, userController.getPaymentMethods);
router.post("/payment-methods", authenticate, validate(paymentMethodSchema), userController.addPaymentMethod);
router.delete("/payment-methods/:id", authenticate, userController.deletePaymentMethod);

// Order history routes
router.get("/orders", authenticate, userController.getMyOrders);
router.get("/orders/:id", authenticate, userController.getOrderDetails);

export default router;