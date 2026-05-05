import { StatusCodes } from 'http-status-codes';
import catchAsync from '@/utils/catchAsync';
import { sendSuccessResponse } from '@/utils/response';
import { testimonialService } from './testimonials.service';

export const createTestimonial = catchAsync(async (req, res) => {
  const data = await testimonialService.createTestimonial(req.body);
  sendSuccessResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Testimonial created successfully',
    data,
  });
});

export const getAllTestimonials = catchAsync(async (_req, res) => {
  const data = await testimonialService.getAllTestimonials();
  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Testimonials fetched successfully',
    data,
  });
});

export const deleteTestimonial = catchAsync(async (req, res) => {
  await testimonialService.deleteTestimonial(req.params.id);
  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Testimonial deleted successfully',
    data: null,
  });
});

export const testimonialController = {
  createTestimonial,
  getAllTestimonials,
  deleteTestimonial,
};
