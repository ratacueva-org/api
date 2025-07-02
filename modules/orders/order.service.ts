import mongoose from "mongoose";
import Order, {
  IOrder,
  IOrderItem,
  IOrderPaymentDetails,
  OrderStatusType,
  OrderStatusValues,
  PaymentStatusType,
  PaymentStatusValues,
  ShippingStatusValues,
} from "../orders/order.model";
import Product, { IProduct } from "../products/product.model";
import User, { Address, Role } from "../users/user.model";
import {
  NotFoundError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
} from "../../core/errors/custom-errors";

// --- INTERFACES DE INPUT PARA EL SERVICIO ---

// Lo que el cliente envía en la creación de un pedido
interface IOrderItemInput {
  productId: string; 
  quantity: number;
  selectedVariation?: string;
}

// Lo que el cliente envía para el método de pago inicial
interface ICreateOrderPaymentInput {
  type: "credit_card" | "debit_card" | "paypal" | "oxxo_cash";
  // Aquí irían tokens, IDs de aprobación de PayPal, etc.
  // Por simplicidad, asumimos que el PaymentService recibe esto y devuelve el transactionId
  paymentGatewayToken?: string; // Ej: Un token de Stripe generado en el frontend
  paypalApprovalId?: string; // Ej: ID de aprobación de PayPal
}

// Payload completo para crear un pedido
interface ICreateOrderPayload {
  items: IOrderItemInput[];
  shippingAddress: Address;
  billingAddress?: Address; // Opcional, si es diferente a la de envío
  paymentMethod: ICreateOrderPaymentInput;
  shippingCost: number; // Asumimos que esto ya fue calculado por el frontend/shipping service
  taxAmount: number; // Asumimos que esto ya fue calculado
  discountAmount?: number; // Si se aplicó un cupón
}

// Payload para actualizar el estado de un pedido (admin/empleado)
interface IUpdateOrderStatusPayload {
  newStatus: OrderStatusType;
  notes?: string;
}


// --- SERVICIO DE ÓRDENES ---

export const OrderService = {
  /**
   * Crea un nuevo pedido para un cliente.
   * Inicia transacción, verifica stock, procesa pago, guarda pedido y deduce stock.
   */
  createOrder: async (userId: string, payload: ICreateOrderPayload): Promise<IOrder> => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { items, shippingAddress, billingAddress, paymentMethod, shippingCost, taxAmount, discountAmount } = payload;

      // 1. Verificar usuario (opcional, pero buena práctica si el userId viene de token)
      const user = await User.findById(userId).session(session);
      if (!user) {
        throw new NotFoundError("Usuario no encontrado.");
      }

      const orderItems: IOrderItem[] = [];
      let subtotal = 0;

      // 2. Procesar ítems: verificar stock, capturar precios y descuentos actuales
      for (const itemInput of items) {
        const product = await Product.findById(itemInput.productId).session(session);

        if (!product) {
          throw new BadRequestError(`Producto con ID ${itemInput.productId} no encontrado.`);
        }
        if (product.stock < itemInput.quantity) {
          throw new ConflictError(`Stock insuficiente para el producto: ${product.name}. Disponible: ${product.stock}, Solicitado: ${itemInput.quantity}`);
        }

        // Crear una "instantánea" del producto al momento de la compra
        const itemPrice = product.price * (1 - (product.discountPercentage || 0) / 100);
        orderItems.push({
          _id: new mongoose.Types.ObjectId(), // Generar un _id para el subdocumento
          productId: new mongoose.Types.ObjectId(product._id),
          name: product.name,
          priceAtAddition: itemPrice,
          quantity: itemInput.quantity,
          selectedVariation: itemInput.selectedVariation,
          imageUrl: product.images[0] || undefined, // Primera imagen
          discountPercentageApplied: product.discountPercentage || 0,
        });
        subtotal += itemPrice * itemInput.quantity;

        // Deducir stock temporalmente (se confirmará con el commit de la transacción)
        await Product.findByIdAndUpdate(
          product._id,
          { $inc: { stock: -itemInput.quantity } },
          { session: session, new: true } // `new: true` para obtener el documento actualizado
        );
      }

      const totalAmount = subtotal + shippingCost + taxAmount - (discountAmount || 0);
      if (totalAmount < 0) { // Pequeña validación extra
        throw new BadRequestError("El monto total del pedido no puede ser negativo.");
      }

      // 3. Procesar Pago (Llamada al PaymentService)
      // *******************************************************************
      // Aquí harías la LLAMADA REAL a tu PaymentService.
      // Por ahora, simulamos una respuesta exitosa.
      // const paymentResult = await PaymentService.processPayment({ ...paymentMethod, amount: totalAmount });
      // if (paymentResult.status !== 'success') {
      //   throw new BadRequestError(`Fallo el procesamiento del pago: ${paymentResult.message}`);
      // }
      // const transactionId = paymentResult.transactionId;
      // *******************************************************************

      // SIMULACIÓN DE RESPUESTA DE PASARELA DE PAGO:
      const simulatedTransactionId = `txn_${new Date().getTime()}_${Math.random().toString(36).substring(2, 10)}`;
      const paymentDetails: IOrderPaymentDetails = {
        type: paymentMethod.type,
        transactionId: simulatedTransactionId, // Este vendría del PaymentService
        // Aquí podrías añadir last4, provider si el PaymentService te los devuelve
      };

      // 4. Crear el documento del pedido
      const newOrder = new Order({
        userId: new mongoose.Types.ObjectId(userId),
        items: orderItems,
        subtotal,
        shippingCost,
        taxAmount,
        discountAmount: discountAmount || 0,
        totalAmount,
        currency: "MXN", // Asumimos MXN, puedes hacerlo configurable
        orderStatus: OrderStatusValues.PROCESSING, // O PENDING si el pago es asíncrono
        paymentStatus: PaymentStatusValues.PAID, // O PENDING si el pago es asíncrono
        shippingStatus: ShippingStatusValues.PENDING,
        shippingAddress,
        billingAddress: billingAddress || shippingAddress, // Si no hay billing, es igual a shipping
        paymentDetails,
        // Otros campos como trackingNumber se añadirán después por el ShippingService
      });

      const createdOrder = await newOrder.save({ session });

      // 5. Iniciar Envío (Llamada al ShippingService)
      // *******************************************************************
      // Aquí harías la LLAMADA REAL a tu ShippingService.
      // Se generaría la etiqueta, el número de seguimiento, etc.
      // const shippingResult = await ShippingService.createShipment(createdOrder._id, shippingAddress, orderItems);
      // await Order.findByIdAndUpdate(createdOrder._id, {
      //   trackingNumber: shippingResult.trackingNumber,
      //   shippingProvider: shippingResult.provider,
      //   estimatedDeliveryDate: shippingResult.estimatedDeliveryDate,
      // }, { session });
      // *******************************************************************

      // 6. Confirmar Transacción
      await session.commitTransaction();
      session.endSession();

      // 7. Enviar Confirmación (Llamada a Servicio de Notificaciones)
      // *******************************************************************
      // NotificationService.sendOrderConfirmation(createdOrder);
      // *******************************************************************

      return createdOrder;

    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      // Si el error es de un tipo conocido, lo relanzamos. Si no, un error genérico.
      if (error instanceof NotFoundError || error instanceof BadRequestError || error instanceof ConflictError) {
        throw error;
      }
      console.error("Error al crear pedido:", error); // Log para depuración interna
      throw new Error("Error interno al procesar el pedido."); // Error genérico para el cliente
    }
  },

  /**
   * Obtiene todos los pedidos (para Admin/Empleado).
   */
  getAllOrders: async (filters: any = {}, pagination: { page: number, limit: number } = { page: 1, limit: 10 }): Promise<IOrder[]> => {
    const skip = (pagination.page - 1) * pagination.limit;
    return Order.find(filters)
      .skip(skip)
      .limit(pagination.limit)
      .sort({ createdAt: -1 }) // Ordenar por más recientes
      .populate('userId', 'name lastName email') // Poblar detalles básicos del usuario
      .lean(); // Devolver objetos JS planos para mejor rendimiento en lecturas
  },

  /**
   * Obtiene un pedido específico por ID (para Admin/Empleado).
   */
  getOrderDetailById: async (orderId: string): Promise<IOrder> => {
    const order = await Order.findById(orderId)
      .populate('userId', 'name lastName email phone addresses')
      .lean();
    if (!order) {
      throw new NotFoundError("Pedido no encontrado.");
    }
    return order;
  },

  /**
   * Obtiene los pedidos de un usuario específico (para Cliente).
   */
  getOrdersByUserId: async (userId: string, pagination: { page: number, limit: number } = { page: 1, limit: 10 }): Promise<IOrder[]> => {
    const skip = (pagination.page - 1) * pagination.limit;
    return Order.find({ userId: userId })
      .skip(skip)
      .limit(pagination.limit)
      .sort({ createdAt: -1 })
      .lean();
  },

  /**
   * Obtiene un pedido específico de un usuario (para Cliente, validando propiedad).
   */
  getClientOrderById: async (userId: string, orderId: string): Promise<IOrder> => {
    const order = await Order.findOne({ _id: orderId, userId: userId }).lean();
    if (!order) {
      throw new NotFoundError("Pedido no encontrado o no pertenece a este usuario.");
    }
    return order;
  },

  /**
   * Actualiza el estado de un pedido (Admin/Empleado).
   * Implementa lógica de transiciones de estado válidas.
   */
  updateOrderStatus: async (orderId: string, payload: IUpdateOrderStatusPayload): Promise<IOrder> => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.findById(orderId).session(session);
      if (!order) {
        throw new NotFoundError("Pedido no encontrado.");
      }

      const oldStatus = order.orderStatus;
      const newStatus = payload.newStatus;

      // Lógica de validación de transiciones de estado (ejemplo):
      if (oldStatus === OrderStatusValues.CANCELLED || oldStatus === OrderStatusValues.REFUNDED || oldStatus === OrderStatusValues.DELIVERED) {
        throw new BadRequestError(`No se puede cambiar el estado de un pedido en estado '${oldStatus}'.`);
      }
      if (newStatus === OrderStatusValues.DELIVERED && oldStatus !== OrderStatusValues.SHIPPED) {
        throw new BadRequestError(`Un pedido solo puede pasar a '${OrderStatusValues.DELIVERED}' si está '${OrderStatusValues.SHIPPED}'.`);
      }
      // ... Agrega más reglas de transición de estados según tu negocio ...

      order.orderStatus = newStatus;
      if (newStatus === OrderStatusValues.DELIVERED) order.deliveredAt = new Date();
      if (newStatus === OrderStatusValues.SHIPPED) order.shippedAt = new Date();
      if (newStatus === OrderStatusValues.CANCELLED) order.cancelledAt = new Date();
      if (newStatus === OrderStatusValues.REFUNDED) order.refundedAt = new Date();

      if (payload.notes) {
        order.notes = order.notes ? `${order.notes}\n${new Date().toISOString()}: ${payload.notes}` : `${new Date().toISOString()}: ${payload.notes}`;
      }

      await order.save({ session });
      await session.commitTransaction();
      session.endSession();

      // *******************************************************************
      // Aquí se podría notificar al cliente o actualizar sistemas externos.
      // NotificationService.sendOrderStatusUpdate(order);
      // *******************************************************************

      return order;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      if (error instanceof NotFoundError || error instanceof BadRequestError) {
        throw error;
      }
      console.error("Error al actualizar estado de pedido:", error);
      throw new Error("Error interno al actualizar el estado del pedido.");
    }
  },

  /**
   * Procesa la cancelación de un pedido (Cliente o Admin/Empleado).
   * Reintegra stock y puede iniciar reembolso.
   */
  cancelOrder: async (orderId: string, currentUserId: string, currentUserRole: Role): Promise<IOrder> => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.findById(orderId).session(session);
      if (!order) {
        throw new NotFoundError("Pedido no encontrado.");
      }

      // Validación de permisos: solo el dueño o un admin/empleado puede cancelar
      if (currentUserRole === 'client' && order.userId.toString() !== currentUserId) {
        throw new ForbiddenError("No tienes permisos para cancelar este pedido.");
      }

      // Validación de estado: solo se puede cancelar si está en un estado cancelable
      if (([OrderStatusValues.SHIPPED, OrderStatusValues.DELIVERED, OrderStatusValues.CANCELLED, OrderStatusValues.REFUNDED] as OrderStatusType[]).includes(order.orderStatus)) {
        throw new BadRequestError(`No se puede cancelar un pedido en estado '${order.orderStatus}'.`);
      }

      order.orderStatus = OrderStatusValues.CANCELLED;
      order.cancelledAt = new Date();
      order.paymentStatus = PaymentStatusValues.REFUNDED; // Asumimos que la cancelación implica reembolso total

      // Reintegrar stock de productos
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: item.quantity } },
          { session: session }
        );
      }

      await order.save({ session });
      await session.commitTransaction();
      session.endSession();

      // *******************************************************************
      // Llamada al PaymentService para iniciar el reembolso real
      // PaymentService.initiateRefund(order.paymentDetails.transactionId, order.totalAmount);
      // Notificar al cliente.
      // NotificationService.sendOrderCancellationConfirmation(order);
      // *******************************************************************

      return order;

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      if (error instanceof NotFoundError || error instanceof BadRequestError || error instanceof ForbiddenError) {
        throw error;
      }
      console.error("Error al cancelar pedido:", error);
      throw new Error("Error interno al cancelar el pedido.");
    }
  },

  /**
   * Actualiza solo el estado de pago de un pedido (normalmente por webhooks de pasarela de pago o Admin).
   */
  updatePaymentStatus: async (orderId: string, newPaymentStatus: PaymentStatusType, transactionId?: string): Promise<IOrder> => {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError("Pedido no encontrado.");
    }

    // Aquí se podría añadir lógica de validación de transiciones de paymentStatus
    order.paymentStatus = newPaymentStatus;
    if (transactionId) {
      order.paymentDetails.transactionId = transactionId; // Asegurarse de actualizar si viene de webhook
    }
    await order.save();
    return order;
  },

  /**
   * Actualiza detalles de envío de un pedido (normalmente por webhook de servicio de envío o Admin).
   */
  updateShippingDetails: async (orderId: string, trackingNumber: string, shippingProvider: string, estimatedDeliveryDate?: Date): Promise<IOrder> => {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError("Pedido no encontrado.");
    }

    order.trackingNumber = trackingNumber;
    order.shippingProvider = shippingProvider;
    order.shippingStatus = ShippingStatusValues.SHIPPED; // Implica que ya se envió
    order.estimatedDeliveryDate = estimatedDeliveryDate;
    order.shippedAt = new Date(); // Registra la fecha de envío

    await order.save();
    return order;
  },
};