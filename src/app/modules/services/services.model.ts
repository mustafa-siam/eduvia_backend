import { Schema, model, Document } from 'mongoose';

export interface ILocalizedString {
  en: string;
  bn: string;
}

export interface IService extends Document {
  slug: string;
  title: ILocalizedString;
  desc: ILocalizedString; // HTML String per language
  image: string;
  content: ILocalizedString; // Full HTML Rich Text per language
  createdAt: Date;
  updatedAt: Date;
}

// Reusable Mongoose sub-schema for multilingual string values
const localizedStringSchema = new Schema<ILocalizedString>(
  {
    en: { type: String, required: true, trim: true },
    bn: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const serviceSchema = new Schema<IService>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: localizedStringSchema, required: true },
    desc: { type: localizedStringSchema, required: true },
    image: { type: String, required: true },
    content: { type: localizedStringSchema, required: true },
  },
  { timestamps: true }
);

const ServiceModel = model<IService>('Service', serviceSchema);
export default ServiceModel;
