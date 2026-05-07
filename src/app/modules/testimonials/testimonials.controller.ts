import { StatusCodes } from 'http-status-codes';
import catchAsync from '@/utils/catchAsync';
import { sendSuccessResponse } from '@/utils/response';
import { testimonialService } from './testimonials.service';
import { cloudinaryConfig } from '@/utils/uploadFile';

export const createTestimonial = catchAsync(async (req, res) => {
  let imgUrl = '';

  // 1. Process File Upload to Cloudinary
  if (req.file) {
    const uploadResult = await cloudinaryConfig.uploadFileToCloudinary(
      req.file.buffer,
      req.file.originalname,
      { folder: 'testimonials' }
    );
    imgUrl = uploadResult.secure_url;
  }

  // 2. Combine file URL with text fields (youtubeLink will be saved as raw URL)
  const payload = {
    ...req.body,
    img: imgUrl,
  };

  const data = await testimonialService.createTestimonial(payload);

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

export const updateTestimonial = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateBody = { ...req.body };

  // 1. If a new image was cropped and uploaded, get the new URL
  if (req.file) {
    const uploadResult = await cloudinaryConfig.uploadFileToCloudinary(
      req.file.buffer,
      req.file.originalname,
      { folder: 'testimonials' }
    );
    updateBody.img = uploadResult.secure_url;
  }

  const data = await testimonialService.updateTestimonial(id, updateBody);

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Testimonial updated successfully',
    data,
  });
});

export const deleteTestimonial = catchAsync(async (req, res) => {
  const { id } = req.params;
  await testimonialService.deleteTestimonial(id);

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Testimonial deleted successfully',
    data: null,
  });
});

export const testimonialController = {
  createTestimonial,
  getAllTestimonials,
  updateTestimonial,
  deleteTestimonial,
};
