import { Schema, model, Document } from 'mongoose';
import { ITestimonials } from './testimonials.schema';

const testimonialsSchema = new Schema<ITestimonials & Document>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const TestimonialsModel = model<ITestimonials & Document>('Testimonials', testimonialsSchema);
export default TestimonialsModel;
