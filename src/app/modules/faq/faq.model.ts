import { Schema, model, Document } from 'mongoose';
import { IFaq } from './faq.schema';

const faqModelSchema = new Schema<IFaq & Document>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const FAQModel = model<IFaq & Document>('FAQ', faqModelSchema);

export default FAQModel;
