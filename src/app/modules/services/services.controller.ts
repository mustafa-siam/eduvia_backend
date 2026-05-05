import catchAsync from '@/utils/catchAsync';
import { sendSuccessResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';
import { serviceService } from './services.service';

export const createService = catchAsync(async (req, res) => {
  const data = await serviceService.createService(req.body);

  sendSuccessResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Service created successfully',
    data,
  });
});

export const getAllServices = catchAsync(async (_req, res) => {
  const data = await serviceService.getAllServices();

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Services fetched successfully',
    data,
  });
});

export const getServiceById = catchAsync(async (req, res) => {
  const data = await serviceService.getServiceById(req.params.id);

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Service fetched successfully',
    data,
  });
});

export const updateService = catchAsync(async (req, res) => {
  const data = await serviceService.updateService(req.params.id, req.body);

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Service updated successfully',
    data,
  });
});

export const deleteService = catchAsync(async (req, res) => {
  const data = await serviceService.deleteService(req.params.id);

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Service deleted successfully',
    data,
  });
});

export const serviceController = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
