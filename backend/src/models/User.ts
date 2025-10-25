import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    county?: string;
  };
  role: 'customer' | 'admin';
  wishlist: mongoose.Types.ObjectId[];
}

const AddressSchema = new Schema(
  {
    street: String,
    city: String,
    county: String,
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: AddressSchema },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
