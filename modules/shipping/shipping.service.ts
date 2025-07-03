import mongoose from 'mongoose';
import { ShipmentModel, IShipment, ShipmentStatus, ITrackingEvent } from './shipping.model';
import { BadRequestError, NotFoundError } from '../../core/errors/custom-errors';
import { Address } from '../users/user.model';

class ShippingService {
    /**
     * Crea un nuevo registro de envío simulado.
     * @param data - Datos para crear el envío.
     * @returns El envío creado.
     */
    async createShipment(data: {
        orderId: string;
        shippingAddress: Address;
        items: { productId: string; quantity: number }[];
        shippingProvider: string;
        estimatedDeliveryDate?: string;
    }): Promise<IShipment> {
        // Validación de IDs de Mongoose
        if (!mongoose.Types.ObjectId.isValid(data.orderId)) {
            throw new BadRequestError('Invalid Order ID format.');
        }
        data.items.forEach(item => {
            if (!mongoose.Types.ObjectId.isValid(item.productId)) {
                throw new BadRequestError(`Invalid Product ID format: ${item.productId}`);
            }
        });

        // Simulación: Generar un número de seguimiento único
        const trackingNumber = `SIM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        const shipmentData = {
            orderId: new mongoose.Types.ObjectId(data.orderId),
            trackingNumber: trackingNumber,
            shippingProvider: data.shippingProvider,
            shippingAddress: data.shippingAddress,
            items: data.items.map(item => ({
                productId: new mongoose.Types.ObjectId(item.productId),
                quantity: item.quantity
            })),
            estimatedDeliveryDate: data.estimatedDeliveryDate ? new Date(data.estimatedDeliveryDate) : undefined,
            currentStatus: ShipmentStatus.PENDING_PICKUP, // Estado inicial
            trackingEvents: [] // Se añade en el pre-save hook del modelo
        };

        const newShipment = new ShipmentModel(shipmentData);
        await newShipment.save();

        console.log(`Simulated shipment created for Order ${data.orderId} with tracking ${newShipment.trackingNumber}`);
        return newShipment;
    }

    /**
     * Obtiene un envío por su ID.
     * @param shipmentId - El ID del envío.
     * @returns El envío.
     */
    async getShipmentById(shipmentId: string): Promise<IShipment> {
        if (!mongoose.Types.ObjectId.isValid(shipmentId)) {
            throw new BadRequestError('Invalid Shipment ID format.');
        }
        const shipment = await ShipmentModel.findById(shipmentId);
        if (!shipment) {
            throw new NotFoundError(`Shipment with ID ${shipmentId} not found.`);
        }
        return shipment;
    }

    /**
     * Obtiene un envío por su número de seguimiento.
     * @param trackingNumber - El número de seguimiento.
     * @returns El envío.
     */
    async getShipmentByTrackingNumber(trackingNumber: string): Promise<IShipment> {
        const shipment = await ShipmentModel.findOne({ trackingNumber });
        if (!shipment) {
            throw new NotFoundError(`Shipment with tracking number ${trackingNumber} not found.`);
        }
        return shipment;
    }

    /**
     * Actualiza el estado de un envío y añade un evento de seguimiento.
     * @param shipmentId - El ID del envío a actualizar.
     * @param newStatus - El nuevo estado del envío.
     * @param location - Ubicación del evento (opcional).
     * @param notes - Notas del evento (opcional).
     * @returns El envío actualizado.
     */
    async updateShipmentStatus(
        shipmentId: string,
        newStatus: ShipmentStatus,
        location?: string,
        notes?: string
    ): Promise<IShipment> {
        const shipment = await this.getShipmentById(shipmentId); // Reutiliza la función de obtención

        if (shipment.currentStatus === newStatus) {
            console.warn(`Shipment ${shipmentId} already has status ${newStatus}. No change.`);
            return shipment;
        }

        // Simulación: Lógica para transiciones de estado
        if (shipment.currentStatus === ShipmentStatus.DELIVERED || shipment.currentStatus === ShipmentStatus.CANCELLED) {
            throw new BadRequestError(`Cannot update status of a ${shipment.currentStatus} shipment.`);
        }

        const newTrackingEvent: ITrackingEvent = {
            status: newStatus,
            timestamp: new Date(),
            location,
            notes,
        };

        shipment.currentStatus = newStatus;
        shipment.trackingEvents.push(newTrackingEvent);
        await shipment.save();

        console.log(`Simulated shipment ${shipmentId} status updated to ${newStatus}`);
        return shipment;
    }

    /**
     * Lista envíos con filtros y paginación.
     * @param filters - Filtros por estado, orderId, shippingProvider.
     * @param pagination - Opciones de paginación (page, limit).
     * @returns Lista de envíos paginada.
     */
    async listShipments(
        filters: { status?: ShipmentStatus; orderId?: string; shippingProvider?: string },
        pagination: { page: number; limit: number }
    ): Promise<{ data: IShipment[]; total: number; page: number; limit: number }> {
        const query: any = {};
        if (filters.status) {
            query.currentStatus = filters.status;
        }
        if (filters.orderId) {
            if (!mongoose.Types.ObjectId.isValid(filters.orderId)) {
                throw new BadRequestError('Invalid Order ID format for filter.');
            }
            query.orderId = new mongoose.Types.ObjectId(filters.orderId);
        }
        if (filters.shippingProvider) {
            query.shippingProvider = filters.shippingProvider;
        }

        const total = await ShipmentModel.countDocuments(query);
        const data = await ShipmentModel.find(query)
            .skip((pagination.page - 1) * pagination.limit)
            .limit(pagination.limit)
            .sort({ createdAt: -1 }); // Ordenar por los más recientes

        return { data, total, page: pagination.page, limit: pagination.limit };
    }
}

export const shippingService = new ShippingService();