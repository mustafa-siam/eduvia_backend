import { Schema, model, Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  destination: string;
  status: 'pending' | 'contacted' | 'resolved';
  pinned: boolean; // ⭐ added
}

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    destination: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'resolved'],
      default: 'pending',
    },
    pinned: {
      type: Boolean,
      default: false, // ⭐ default
    },
  },
  { timestamps: true }
);

export const ContactModel = model<IContact>('Contact', contactSchema);
