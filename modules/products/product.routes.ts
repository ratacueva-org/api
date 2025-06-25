import { Router } from "express";
import * as productController from "../../modules/products/product.controller";
import { authenticate } from "../../core/middlewares/auth.middleware";
import { authorize } from "../../core/middlewares/role.middleware";
import { upload } from "../../core/middlewares/upload.middleware";
import { validate } from "../../core/middlewares/validate.middleware";
import {
  createProductSchema,
  updateProductSchema,
  updateStockSchema,
  updateDiscountSchema,
  updateIsFeaturedSchema,
  updateIsNewSchema,
} from "../../modules/products/product.schema";
import { requireImages } from "../../core/middlewares/requireImages.middleware";

const router = Router();

// Rutas públicas
router.get("/get", productController.getAllProducts);
router.get("/get/:id", productController.getProductById);

// Rutas protegidas (solo empleados y admins)
router.post(
  "/add",
  authenticate,
  authorize("employee", "admin"),
  upload.array("images"),
  requireImages,
  validate(createProductSchema),
  productController.addProduct
);

router.put(
  "/update/:id",
  authenticate,
  authorize("employee", "admin"),
  upload.array("images"),
  requireImages,
  validate(updateProductSchema),
  productController.updateProduct
);

router.patch(
  "/:id/stock",
  authenticate,
  authorize("employee", "admin"),
  validate(updateStockSchema),
  productController.updateStockProduct
);

router.patch(
  "/:id/discount",
  authenticate,
  authorize("employee", "admin"),
  validate(updateDiscountSchema),
  productController.updateDiscountProduct
);

router.patch(
  "/:id/is-featured",
  authenticate,
  authorize("employee", "admin"),
  validate(updateIsFeaturedSchema),
  productController.updateIsFeaturedProduct
);

router.patch(
  "/:id/is-new",
  authenticate,
  authorize("employee", "admin"),
  validate(updateIsNewSchema),
  productController.updateIsNewProduct
);

router.delete(
  "/delete/:id",
  authenticate,
  authorize("employee", "admin"),
  productController.deleteProduct
);

export default router;
