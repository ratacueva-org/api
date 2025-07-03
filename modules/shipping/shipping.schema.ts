import { z } from 'zod';
import { ShipmentStatus } from './shipping.model'; // Importa el enum del modelo
import { addressSchema } from '../users/user.schema'; // Importa el esquema de dirección

export const CreateShipmentSchema = z.object({
    orderId: z.string().min(1, "El ID del pedido es requerido."), // Asume que es un string de ObjectId
    shippingAddress: addressSchema,
    items: z.array(z.object({
        productId: z.string().min(1, "El ID del producto es requerido."),
        quantity: z.number().int().min(1, "La cantidad debe ser al menos 1."),
    })).min(1, "El envío debe contener al menos un producto."),
    shippingProvider: z.string().min(1, "El proveedor de envío es requerido."),
    estimatedDeliveryDate: z.string().datetime("Formato de fecha inválido para la fecha de entrega estimada.").optional(),
});

// Esquema para la actualización del estado de un envío (PATCH /api/shipping/shipments/:shipmentId/status)
export const UpdateShipmentStatusSchema = z.object({
    newStatus: z.nativeEnum(ShipmentStatus, {
        errorMap: () => ({ message: "Estado de envío inválido." })
    }),
    location: z.string().optional(),
    timestamp: z.string().datetime("Formato de fecha inválido para el timestamp.").optional(),
    notes: z.string().optional(),
});

// Esquema para obtener un envío por ID (GET /api/shipping/shipments/:shipmentId)
export const GetShipmentByIdParamSchema = z.object({
    shipmentId: z.string().min(1, "El ID del envío es requerido."),
});

// Esquema para obtener un envío por Tracking Number (GET /api/shipping/track/:trackingNumber)
export const GetShipmentByTrackingNumberParamSchema = z.object({
    trackingNumber: z.string().min(1, "El número de seguimiento es requerido."),
});

// Esquema para listar envíos (GET /api/shipping/shipments)
export const ListShipmentsQuerySchema = z.object({
    page: z.string().transform(Number).pipe(z.number().int().min(1)).default("1").optional(),
    limit: z.string().transform(Number).pipe(z.number().int().min(1)).default("10").optional(),
    status: z.nativeEnum(ShipmentStatus).optional(),
    orderId: z.string().optional(), // Para filtrar por pedido
    shippingProvider: z.string().optional(),
});