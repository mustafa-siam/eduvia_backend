// testimonials.model.ts
import { Schema, model, Document } from 'mongoose';
import { ITestimonial } from './testimonials.schema';

const localizedStringSchema = new Schema(
  {
    en: { type: String, required: true, trim: true },
    bn: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const testimonialSchema = new Schema<ITestimonial & Document>(
  {
    name: { type: localizedStringSchema, required: true },
    role: { type: localizedStringSchema, required: true },
    img: { type: String, required: true, trim: true },
    youtubeLink: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const TestimonialModel = model<ITestimonial & Document>('Testimonial', testimonialSchema);

export default TestimonialModel;
