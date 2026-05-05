import { Schema, model, Document } from 'mongoose';
import { ITestimonial } from './testimonials.schema';

const testimonialSchema = new Schema<ITestimonial & Document>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    img: { type: String, required: true, trim: true },
    youtubeLink: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const TestimonialModel = model<ITestimonial & Document>('Testimonial', testimonialSchema);
export default TestimonialModel;
