// src/modules/shipping/shipping.controller.ts
import { Request, Response, NextFunction } from 'express';
import { shippingService } from './shipping.service';
import { ShipmentStatus } from './shipping.model'; // Para el tipo de estado

class ShippingController {
    /**
     * Crea un nuevo envío simulado.
     * POST /api/shipping/shipments
     */
    async createShipment(req: Request, res: Response, next: NextFunction) {
        try {
            // Asume que req.body ya ha sido validado por validateBody
            const newShipment = await shippingService.createShipment(req.body);
            res.status(201).json({ message: 'Shipment created successfully', data: newShipment });
        } catch (error) {
            next(error); // Pasa el error al manejador de errores global
        }
    }

    /**
     * Obtiene los detalles de un envío por ID.
     * GET /api/shipping/shipments/:shipmentId
     */
    async getShipmentById(req: Request, res: Response, next: NextFunction) {
        try {
            // Asume que req.params ya ha sido validado por validateParams
            const { shipmentId } = req.params;
            const shipment = await shippingService.getShipmentById(shipmentId);
            res.status(200).json({ message: 'Shipment fetched successfully', data: shipment });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Obtiene los detalles de un envío por número de seguimiento.
     * GET /api/shipping/track/:trackingNumber
     */
    async getShipmentByTrackingNumber(req: Request, res: Response, next: NextFunction) {
        try {
            // Asume que req.params ya ha sido validado por validateParams
            const { trackingNumber } = req.params;
            const shipment = await shippingService.getShipmentByTrackingNumber(trackingNumber);
            res.status(200).json({ message: 'Shipment fetched successfully', data: shipment });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Actualiza el estado de un envío.
     * PATCH /api/shipping/shipments/:shipmentId/status
     */
    async updateShipmentStatus(req: Request, res: Response, next: NextFunction) {
        try {
            // Asume que req.params y req.body ya han sido validados
            const { shipmentId } = req.params;
            const { newStatus, location, notes } = req.body;

            const updatedShipment = await shippingService.updateShipmentStatus(
                shipmentId,
                newStatus as ShipmentStatus, // Asegura el tipo
                location,
                notes
            );
            res.status(200).json({ message: 'Shipment status updated successfully', data: updatedShipment });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lista todos los envíos con filtros y paginación.
     * GET /api/shipping/shipments
     */
    async listShipments(req: Request, res: Response, next: NextFunction) {
        try {
            // Asume que req.query ya ha sido validado por validateQuery
            const { status, orderId, shippingProvider, page, limit } = req.query as {
                status?: ShipmentStatus;
                orderId?: string;
                shippingProvider?: string;
                page?: number;
                limit?: number;
            };

            const pagination = {
                page: page || 1,
                limit: limit || 10,
            };

            const filters = { status, orderId, shippingProvider };

            const result = await shippingService.listShipments(filters, pagination);
            res.status(200).json({
                message: 'Shipments fetched successfully',
                data: result.data,
                meta: {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: Math.ceil(result.total / result.limit),
                },
            });
        } catch (error) {
            next(error);
        }
    }
}

export const shippingController = new ShippingController();