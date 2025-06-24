import { Router } from "express";
import * as productController from "../../modules/products/product.controller";
import { authenticate } from "../../core/middlewares/auth.middleware";
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

const router = Router();

// Rutas públicas
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Rutas protegidas (solo para admins o panel de gestión)
router.post(
  "/",
  authenticate,
  upload.array("images"),
  validate(createProductSchema),
  productController.addProduct
);

router.put(
  "/:id",
  authenticate,
  upload.array("images"),
  validate(updateProductSchema),
  productController.updateProduct
);

router.patch(
  "/:id/stock",
  authenticate,
  validate(updateStockSchema),
  productController.updateStockProduct
);

router.patch(
  "/:id/discount",
  authenticate,
  validate(updateDiscountSchema),
  productController.updateDiscountProduct
);

router.patch(
  "/:id/is-featured",
  authenticate,
  validate(updateIsFeaturedSchema),
  productController.updateIsFeaturedProduct
);

router.patch(
  "/:id/is-new",
  authenticate,
  validate(updateIsNewSchema),
  productController.updateIsNewProduct
);

router.delete("/:id", authenticate, productController.deleteProduct);

export default router;
