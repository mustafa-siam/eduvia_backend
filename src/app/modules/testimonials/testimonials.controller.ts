import catchAsync from '@/utils/catchAsync';
import { testimonialsService } from './testimonials.service';
import { sendSuccessResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';

export const testimonialsHandler = catchAsync(async (req, res) => {
  const data = await testimonialsService.createTestimonials(req.body);
  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Testimonials request processed',
    data,
  });
});

export const testimonialsController = {
  testimonialsHandler,
};
