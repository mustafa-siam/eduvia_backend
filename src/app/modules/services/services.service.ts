import { IServices } from './services.schema';
import ServicesModel from './services.model';

const createServices = async (payload: IServices) => {
  const created = await ServicesModel.create(payload);
  return created;
};

export const servicesService = {
  createServices,
};
