import AppError from '@/app/errors/handlers/AppError';
import { StatusCodes } from 'http-status-codes';
import ServiceModel from './services.model';
import { IService } from './services.schema';

const createService = async (payload: IService) => {
  return await ServiceModel.create(payload);
};

const getAllServices = async () => {
  return await ServiceModel.find().sort({ createdAt: -1 }).lean();
};

const getServiceById = async (id: string) => {
  const service = await ServiceModel.findById(id).lean();

  if (!service) {
    throw new AppError('Service not found', StatusCodes.NOT_FOUND);
  }

  return service;
};

const updateService = async (id: string, payload: Partial<IService>) => {
  const updated = await ServiceModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updated) {
    throw new AppError('Service not found', StatusCodes.NOT_FOUND);
  }

  return updated;
};

const deleteService = async (id: string) => {
  const deleted = await ServiceModel.findByIdAndDelete(id).lean();

  if (!deleted) {
    throw new AppError('Service not found', StatusCodes.NOT_FOUND);
  }

  return deleted;
};

export const serviceService = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
