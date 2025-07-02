import { Router } from "express";
import { OrderController } from "./order.controller";
import { authenticate } from "../../core/middlewares/auth.middleware";
import { authorize } from "../../core/middlewares/role.middleware";
import { validate, validateQuery, validateParams } from "../../core/middlewares/validate.middleware"; 

import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderIdParamSchema,
  paginationQuerySchema,
  updatePaymentStatusSchema,
  updateShippingDetailsSchema,
} from "./order.schema"; 

const router = Router();

// Rutas de Cliente
router.post(
  "/",
  authenticate,
  authorize("client"), // Solo clientes pueden crear pedidos por esta vía
  validate(createOrderSchema),
  OrderController.createOrder
);

router.get(
  "/",
  authenticate,
  authorize("client", "employee", "admin"),
  validateQuery(paginationQuerySchema),
  OrderController.getOrders
);

// Client (solo puede ver sus propios pedidos), employee, admin (cualquier pedido)
router.get(
  "/:orderId",
  authenticate,
  authorize("client", "employee", "admin"),
  validateParams(orderIdParamSchema),
  OrderController.getOrderDetail
);

// Client (solo puede cancelar sus propios pedidos), employee, admin (cualquier pedido)
router.patch(
  "/:orderId/cancel",
  authenticate,
  authorize("client", "employee", "admin"),
  validateParams(orderIdParamSchema),
  OrderController.cancelOrder
);

// Rutas de Admin/Empleado
router.patch(
  "/:orderId/status",
  authenticate,
  authorize("admin", "employee"),
  validateParams(orderIdParamSchema),
  validate(updateOrderStatusSchema),
  OrderController.updateOrderStatus
);

router.patch(
  "/:orderId/payment-status",
  authenticate,
  authorize("admin", "employee"),
  validateParams(orderIdParamSchema),
  validate(updatePaymentStatusSchema),
  OrderController.updatePaymentStatus
);

/* router.patch(
  "/:orderId/shipping-details",
  authenticate,
  authorize("admin", "employee"),
  validateParams(orderIdParamSchema),
  validate(updateShippingDetailsSchema),
  OrderController.updateShippingDetails
); */

export default router;