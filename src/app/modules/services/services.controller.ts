import catchAsync from '@/utils/catchAsync';
import { sendSuccessResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';
import { serviceService } from './services.service';
import AppError from '@/app/errors/handlers/AppError';
import { cloudinaryConfig } from '@/utils/uploadFile';

// 1. Define getAllServices
const getAllServices = catchAsync(async (_req, res) => {
  const data = await serviceService.getAllServices();
  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Services fetched successfully',
    data,
  });
});

// 2. Define getServiceById
const getServiceById = catchAsync(async (req, res) => {
  const data = await serviceService.getServiceById(req.params.id);
  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Service fetched successfully',
    data,
  });
});

// 3. Define createService
const createService = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError('Service image is required', StatusCodes.BAD_REQUEST);
  }

  const uploadResult = await cloudinaryConfig.uploadFileToCloudinary(
    req.file.buffer,
    req.file.originalname,
    { folder: 'services' }
  );

  const data = await serviceService.createService({
    ...req.body,
    image: uploadResult.secure_url,
  });

  sendSuccessResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Service created successfully',
    data,
  });
});

// 4. Define updateService
const updateService = catchAsync(async (req, res) => {
  const { id } = req.params;
  let payload = { ...req.body };

  if (req.file) {
    const existing = await serviceService.getServiceById(id);
    const oldPublicId = cloudinaryConfig.getPublicIdFromUrl(existing.image);
    if (oldPublicId) {
      await cloudinaryConfig.deleteFileFromCloudinary(oldPublicId, 'image');
    }

    const uploadResult = await cloudinaryConfig.uploadFileToCloudinary(
      req.file.buffer,
      req.file.originalname,
      { folder: 'services' }
    );
    payload.image = uploadResult.secure_url;
  }

  const data = await serviceService.updateService(id, payload);

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Service updated successfully',
    data,
  });
});

// 5. Define deleteService
const deleteService = catchAsync(async (req, res) => {
  const { id } = req.params;
  const service = await serviceService.getServiceById(id);

  const publicId = cloudinaryConfig.getPublicIdFromUrl(service.image);
  if (publicId) {
    await cloudinaryConfig.deleteFileFromCloudinary(publicId, 'image');
  }

  await serviceService.deleteService(id);

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Service and image deleted successfully',
    data: null,
  });
});

// Now the shorthand properties will work because the variables exist in scope
export const serviceController = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
