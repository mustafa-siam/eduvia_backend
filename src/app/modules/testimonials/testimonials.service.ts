import { ITestimonials } from './testimonials.schema';
import TestimonialsModel from './testimonials.model';

const createTestimonials = async (payload: ITestimonials) => {
  const created = await TestimonialsModel.create(payload);
  return created;
};

export const testimonialsService = {
  createTestimonials,
};
