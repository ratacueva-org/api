import { Router } from 'express';
import { shippingController } from './shipping.controller';
import { authenticate } from '../../core/middlewares/auth.middleware';
import { authorize } from '../../core/middlewares/role.middleware'
import { validate, validateParams, validateQuery } from '../../core/middlewares/validate.middleware';

import {
    CreateShipmentSchema,
    UpdateShipmentStatusSchema,
    GetShipmentByIdParamSchema,
    GetShipmentByTrackingNumberParamSchema,
    ListShipmentsQuerySchema,
} from './shipping.schema';

const router = Router();

// Crear un nuevo envío (ej: llamado internamente cuando un pedido se marca como 'shipped')
router.post(
    '/',
    authenticate,
    authorize('admin', 'employee'), // Solo personal puede crear envíos directamente
    validate(CreateShipmentSchema),
    shippingController.createShipment
);

// Obtener todos los envíos con filtros y paginación
router.get(
    '/',
    authenticate,
    authorize('admin', 'employee'), // Solo personal puede listar todos los envíos
    validateQuery(ListShipmentsQuerySchema),
    shippingController.listShipments
);

// Obtener detalles de un envío por su ID
router.get(
    '/:shipmentId',
    authenticate,
    authorize('admin', 'employee', 'client'), // Clientes solo deberían ver los suyos si OrderController los filtra
    validateParams(GetShipmentByIdParamSchema),
    shippingController.getShipmentById
);

// Actualizar el estado de un envío (simulación de eventos de seguimiento)
router.patch(
    '/:shipmentId/status',
    authenticate,
    authorize('admin', 'employee'), // Solo personal puede actualizar el estado
    validateParams(GetShipmentByIdParamSchema),
    validate(UpdateShipmentStatusSchema),
    shippingController.updateShipmentStatus
);

// --- Rutas de Seguimiento (más orientadas al cliente) ---

// Obtener detalles de un envío por su número de seguimiento (más público)
router.get(
    '/track/:trackingNumber',
    authenticate, // Podría hacerse público según sea necesario, pero por seguridad, se mantiene autenticado
    validateParams(GetShipmentByTrackingNumberParamSchema),
    shippingController.getShipmentByTrackingNumber
);

export default router;