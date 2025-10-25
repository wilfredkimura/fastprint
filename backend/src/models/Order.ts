import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  unitPrice: number;
  customizationDetails?: Record<string, any>;
}

export interface IOrder extends Document {
  userId?: mongoose.Types.ObjectId | null;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  shippingAddress?: {
    street?: string;
    city?: string;
    county?: string;
  };
  items: IOrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  orderStatus: 'Pending' | 'Processing' | 'Ready for Pickup' | 'Shipped' | 'Completed' | 'Cancelled';
  paymentStatus: 'Pending M-Pesa' | 'Paid';
  trackingNumber?: string;
  orderedAt: Date;
}

const AddressSchema = new Schema(
  {
    street: String,
    city: String,
    county: String,
  },
  { _id: false }
);

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    customizationDetails: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    customerName: { type: String },
    customerPhone: { type: String },
    customerEmail: { type: String },
    shippingAddress: { type: AddressSchema },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    orderStatus: { type: String, enum: ['Pending', 'Processing', 'Ready for Pickup', 'Shipped', 'Completed', 'Cancelled'], default: 'Pending' },
    paymentStatus: { type: String, enum: ['Pending M-Pesa', 'Paid'], default: 'Pending M-Pesa' },
    trackingNumber: { type: String },
    orderedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
