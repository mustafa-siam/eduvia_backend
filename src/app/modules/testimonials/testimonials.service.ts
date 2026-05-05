import { StatusCodes } from 'http-status-codes';
import AppError from '@/app/errors/handlers/AppError';
import TestimonialModel from './testimonials.model';
import { ITestimonial } from './testimonials.schema';

const createTestimonial = async (payload: ITestimonial) => {
  // Regex to extract the 11-character Video ID from any YouTube URL
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = payload.youtubeLink.match(regExp);
  const videoId = match && match[7].length === 11 ? match[7] : null;

  if (!videoId) {
    throw new AppError(
      'Invalid YouTube URL. Please provide a valid link.',
      StatusCodes.BAD_REQUEST
    );
  }

  // We save the cleaned ID into the database
  const result = await TestimonialModel.create({
    ...payload,
    youtubeLink: videoId,
  });
  return result;
};

const getAllTestimonials = async () => {
  return await TestimonialModel.find().sort({ createdAt: -1 }).lean();
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
  deleteTestimonial,
};
