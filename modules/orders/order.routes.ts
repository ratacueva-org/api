import { Router } from "express";
import { OrderController } from "./order.controller";
import { authenticate } from "../../core/middlewares/auth.middleware";
import { authorize } from "../../core/middlewares/role.middleware";
import { validate } from "../../core/middlewares/validate.middleware"; 

import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderIdParamSchema,
  paginationQuerySchema,
  updatePaymentStatusSchema,
  updateShippingDetailsSchema,
} from "./order.schema"; // Asegúrate de la ruta correcta

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
  authorize("client", "employee", "admin"), // Clientes ven sus pedidos, Admins/Empleados ven todos
  validate(paginationQuerySchema),
  OrderController.getOrders
);

router.get(
  "/:orderId",
  authenticate,
  authorize("client", "employee", "admin"),
  validate(orderIdParamSchema),
  OrderController.getOrderDetail
);

router.patch(
  "/:orderId/cancel",
  authenticate,
  authorize("client", "employee", "admin"), // Cliente puede cancelar los suyos, Admins/Empleados cualquiera
  validate(orderIdParamSchema),
  OrderController.cancelOrder
);

// Rutas de Admin/Empleado
router.patch(
  "/:orderId/status",
  authenticate,
  authorize("admin", "employee"),
  validate(updateOrderStatusSchema),
  OrderController.updateOrderStatus
);

router.patch(
  "/:orderId/payment-status",
  authenticate,
  authorize("admin", "employee"), // Idealmente, esto lo usarían webhooks de la pasarela, o un admin manualmente.
  validate(updatePaymentStatusSchema),
  OrderController.updatePaymentStatus
);

router.patch(
  "/:orderId/shipping-details",
  authenticate,
  authorize("admin", "employee"), // Idealmente, esto lo usarían webhooks del servicio de envío, o un admin manualmente.
  validate(updateShippingDetailsSchema),
  OrderController.updateShippingDetails
);

export default router;