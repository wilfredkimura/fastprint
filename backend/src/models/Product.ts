import mongoose, { Schema, Document } from 'mongoose';

export type CustomizationOption =
  | { type: 'text'; label: string; priceImpact?: number; key: string }
  | { type: 'imageUpload'; label: string; priceImpact?: number; key: string }
  | { type: 'select'; label: string; options: string[]; priceImpact?: Record<string, number>; key: string };

export interface IProduct extends Document {
  name: string;
  description?: string;
  basePrice: number;
  category: mongoose.Types.ObjectId;
  images: string[];
  customizationOptions: CustomizationOption[];
  stockQuantity: number;
  isFeatured: boolean;
}

const CustomizationOptionSchema = new Schema(
  {
    type: { type: String, enum: ['text', 'imageUpload', 'select'], required: true },
    label: { type: String, required: true },
    key: { type: String, required: true },
    priceImpact: { type: Schema.Types.Mixed },
    options: [{ type: String }],
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    basePrice: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [{ type: String }],
    customizationOptions: { type: [CustomizationOptionSchema], default: [] },
    stockQuantity: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
