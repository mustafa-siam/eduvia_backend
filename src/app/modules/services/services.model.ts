import { Schema, model, Document } from 'mongoose';

export interface IService extends Document {
  slug: string;
  title: string;
  desc: string; // HTML String
  image: string;
  content: string; // Changed from string[] to string
}

const serviceSchema = new Schema<IService>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    // Changed to a single string to store full HTML
    content: { type: String, default: '' },
  },
  { timestamps: true }
);

const ServiceModel = model<IService>('Service', serviceSchema);
export default ServiceModel;
