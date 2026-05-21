// testimonials.controller.ts
import { StatusCodes } from 'http-status-codes';
import catchAsync from '@/utils/catchAsync';
import { sendSuccessResponse } from '@/utils/response';
import { testimonialService } from './testimonials.service';
import { cloudinaryConfig } from '@/utils/uploadFile';

/**
 * Reusable utility to parse incoming multipart/form-data into deep language structures
 */
const parseMultipartPayload = (body: any) => {
  const result = { ...body };

  // If payload fields are parsed flat as strings (e.g., body['name[en]']), convert them to nested objects
  if (body['name[en]'] || body['name[bn]']) {
    result.name = {
      en: body['name[en]'] || '',
      bn: body['name[bn]'] || '',
    };
    delete result['name[en]'];
    delete result['name[bn]'];
  }

  if (body['role[en]'] || body['role[bn]']) {
    result.role = {
      en: body['role[en]'] || '',
      bn: body['role[bn]'] || '',
    };
    delete result['role[en]'];
    delete result['role[bn]'];
  }

  return result;
};

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

  // 2. Parse flattened multipart keys safely into multilingual data structures
  const parsedBody = parseMultipartPayload(req.body);

  const payload = {
    ...parsedBody,
    img: imgUrl,
  };

  // Re-assign payload to req.body so validateRequest middleware reads the correct object layout
  req.body = payload;

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

  const parsedBody = parseMultipartPayload(req.body);
  const updateBody = { ...parsedBody };

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
