import mongoose, { Document, Schema } from 'mongoose';
import { Address } from '../users/user.model';

// --- Enums ---
export enum ShipmentStatus {
    PENDING_PICKUP = 'pending_pickup',
    IN_TRANSIT = 'in_transit',
    DELIVERED = 'is_delivered', // Renombrado a is_delivered para evitar conflicto con DeliveryStatus
    EXCEPTION = 'exception',
    CANCELLED = 'cancelled',
}

export interface ITrackingEvent {
    status: ShipmentStatus;
    timestamp: Date;
    location?: string;
    notes?: string;
}

export interface IShipment extends Document {
    orderId: mongoose.Types.ObjectId; // Referencia al ID del pedido en el módulo de órdenes
    trackingNumber: string;
    shippingProvider: string; // Simulado
    currentStatus: ShipmentStatus;
    shippingAddress: Address;
    items: { productId: mongoose.Types.ObjectId; quantity: number }[]; // Productos en el envío
    estimatedDeliveryDate?: Date;
    trackingEvents: ITrackingEvent[];
    shipmentCost?: number; // Costo del envío, opcional
    createdAt: Date;
    updatedAt: Date;
}

// --- Mongoose Schemas ---

const ShippingAddressSchema: Schema = new Schema({
    postalCode: { type: String, required: true },
    street: { type: String, required: true },
    externalNumber: { type: String },
    internalNumber: { type: String },
    neighborhood: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
}, { _id: false });

const TrackingEventSchema: Schema = new Schema({
    status: { type: String, enum: Object.values(ShipmentStatus), required: true },
    timestamp: { type: Date, default: Date.now, required: true },
    location: { type: String },
    notes: { type: String },
}, { _id: false });

const ShipmentSchema: Schema = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true }, // Un envío por pedido
    trackingNumber: { type: String, required: true, unique: true },
    shippingProvider: { type: String, required: true },
    currentStatus: { type: String, enum: Object.values(ShipmentStatus), default: ShipmentStatus.PENDING_PICKUP, required: true },
    shippingAddress: { type: ShippingAddressSchema, required: true },
    items: [{
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
    }],
    estimatedDeliveryDate: { type: Date },
    trackingEvents: { type: [TrackingEventSchema], default: [] },
}, { timestamps: true });

// Añadir un evento inicial al crear el envío
ShipmentSchema.pre('save', function (this: IShipment, next) {
    if (this.isNew) {
        this.trackingEvents.push({
            status: this.currentStatus,
            timestamp: new Date(),
            notes: 'Shipment created'
        });
    }
    next();
});

export const ShipmentModel = mongoose.model<IShipment>('Shipment', ShipmentSchema);