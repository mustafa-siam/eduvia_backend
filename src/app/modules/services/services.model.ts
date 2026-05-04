import { Schema, model, Document } from 'mongoose';
import { IServices } from './services.schema';

const servicesSchema = new Schema<IServices & Document>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const ServicesModel = model<IServices & Document>('Services', servicesSchema);
export default ServicesModel;
