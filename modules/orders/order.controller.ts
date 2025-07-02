import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../core/middlewares/auth.middleware";
import { OrderService } from "./order.service";

export const OrderController = {
  /**
   * @route POST /api/orders
   * @description Crea un nuevo pedido.
   * @access Cliente
   */
  async createOrder(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const orderPayload = req.body;
    const newOrder = await OrderService.createOrder(userId, orderPayload);
    res.status(201).json({
      message: "Pedido creado exitosamente.",
      order: newOrder,
    });
  },

  /**
   * @route GET /api/orders
   * @description Obtiene todos los pedidos (para Admin/Empleado) o solo los del usuario (para Cliente).
   * @access Admin | Empleado | Cliente
   */
  async getOrders(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { page, limit, status } = req.query;

    const pagination = { page: Number(page) || 1, limit: Number(limit) || 10 };
    const filters: any = {};
    if (status) filters.orderStatus = status;

    let orders;
    if (userRole === "client") {
      orders = await OrderService.getOrdersByUserId(userId, pagination);
    } else if (userRole === "admin" || userRole === "employee") {
      orders = await OrderService.getAllOrders(filters, pagination);
    } else {
      throw new Error("Rol de usuario desconocido.");
    }

    res.status(200).json({
      message: "Pedidos obtenidos exitosamente.",
      orders,
    });
  },

  /**
   * @route GET /api/orders/:orderId
   * @description Obtiene los detalles de un pedido específico.
   * @access Admin | Empleado (cualquier pedido) | Cliente (solo sus pedidos)
   */
  async getOrderDetail(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { orderId } = req.params;

    let order;
    if (userRole === "client") {
      order = await OrderService.getClientOrderById(userId, orderId);
    } else if (userRole === "admin" || userRole === "employee") {
      order = await OrderService.getOrderDetailById(orderId);
    } else {
      throw new Error("Rol de usuario desconocido.");
    }

    res.status(200).json({
      message: "Detalles del pedido obtenidos exitosamente.",
      order,
    });
  },

  /**
   * @route PATCH /api/orders/:orderId/status
   * @description Actualiza el estado de un pedido.
   * @access Admin | Empleado
   */
  async updateOrderStatus(req: AuthenticatedRequest, res: Response) {
    const { orderId } = req.params;
    const { newStatus, notes } = req.body;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const updatedOrder = await OrderService.updateOrderStatus(orderId, { newStatus, notes });
    res.status(200).json({
      message: "Estado del pedido actualizado exitosamente.",
      order: updatedOrder,
    });
  },

  /**
   * @route PATCH /api/orders/:orderId/cancel
   * @description Cancela un pedido.
   * @access Cliente | Admin | Empleado
   */
  async cancelOrder(req: AuthenticatedRequest, res: Response) {
    const { orderId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const cancelledOrder = await OrderService.cancelOrder(orderId, userId, userRole);
    res.status(200).json({
      message: "Pedido cancelado exitosamente.",
      order: cancelledOrder,
    });
  },

  /**
   * @route PATCH /api/orders/:orderId/payment-status
   * @description Actualiza el estado de pago de un pedido (idealmente por webhook o Admin).
   * @access Admin | Empleado
   */
  async updatePaymentStatus(req: AuthenticatedRequest, res: Response) {
    const { orderId } = req.params;
    const { newPaymentStatus, transactionId } = req.body;

    const updatedOrder = await OrderService.updatePaymentStatus(orderId, newPaymentStatus, transactionId);
    res.status(200).json({
      message: "Estado de pago del pedido actualizado exitosamente.",
      order: updatedOrder,
    });
  },

  /**
   * @route PATCH /api/orders/:orderId/shipping-details
   * @description Actualiza los detalles de envío de un pedido (idealmente por webhook o Admin).
   * @access Admin | Empleado
   */
  async updateShippingDetails(req: AuthenticatedRequest, res: Response) {
    const { orderId } = req.params;
    const { trackingNumber, shippingProvider, estimatedDeliveryDate } = req.body;

    const updatedOrder = await OrderService.updateShippingDetails(
      orderId,
      trackingNumber,
      shippingProvider,
      estimatedDeliveryDate ? new Date(estimatedDeliveryDate) : undefined
    );
    res.status(200).json({
      message: "Detalles de envío del pedido actualizados exitosamente.",
      order: updatedOrder,
    });
  },
};