import { Schema, model, Document } from 'mongoose';
import { IFaq } from './faq.schema';

const localizedSchemaDefinition = {
  en: {
    type: String,
    required: true,
    trim: true,
  },
  bn: {
    type: String,
    required: true,
    trim: true,
  },
};

const faqModelSchema = new Schema<IFaq & Document>(
  {
    question: {
      type: localizedSchemaDefinition,
      required: true,
    },
    answer: {
      type: localizedSchemaDefinition,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const FAQModel = model<IFaq & Document>('FAQ', faqModelSchema);

export default FAQModel;
