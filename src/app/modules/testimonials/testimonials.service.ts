import AppError from '@/app/errors/handlers/AppError';
import TestimonialModel from './testimonials.model';
import { ITestimonial } from './testimonials.schema';
import { StatusCodes } from 'http-status-codes';

const createTestimonial = async (payload: ITestimonial) => {
  // Saves exactly what the user provided in the youtubeLink field
  const result = await TestimonialModel.create(payload);
  return result;
};

const getAllTestimonials = async () => {
  return await TestimonialModel.find().sort({ createdAt: -1 }).lean();
};

const updateTestimonial = async (id: string, payload: Partial<ITestimonial>) => {
  const result = await TestimonialModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true, // Ensures the new URL still matches Zod/Mongoose rules
  });

  if (!result) {
    throw new AppError('Testimonial not found', StatusCodes.NOT_FOUND);
  }

  return result;
};

const deleteTestimonial = async (id: string) => {
  const result = await TestimonialModel.findByIdAndDelete(id);
  if (!result) {
    throw new AppError('Testimonial not found', StatusCodes.NOT_FOUND);
  }
  return result;
};

export const testimonialService = {
  createTestimonial,
  getAllTestimonials,
  updateTestimonial,
  deleteTestimonial,
};
