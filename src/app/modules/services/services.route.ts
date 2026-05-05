import { Router } from 'express';
import { serviceController } from './services.controller';
import validateRequest from '@/app/middlewares/validateRequest';
import { serviceSchema } from './services.schema';
import { defineRoutes } from '@/utils/defineRoutes';

const serviceRouter = Router();

defineRoutes(serviceRouter, [
  {
    method: 'get',
    path: '/',
    handler: serviceController.getAllServices,
  },
  {
    method: 'get',
    path: '/:id',
    handler: serviceController.getServiceById,
  },
  {
    method: 'post',
    path: '/create',
    // middlewares: [
    //   validateRequest(serviceSchema.createService),
    // ],
    handler: serviceController.createService,
  },
  {
    method: 'patch',
    path: '/:id',
    middlewares: [validateRequest(serviceSchema.updateService)],
    handler: serviceController.updateService,
  },
  {
    method: 'delete',
    path: '/:id',
    handler: serviceController.deleteService,
  },
]);

export default serviceRouter;
