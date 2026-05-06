import { Router } from 'express';
import { serviceController } from './services.controller';
import { defineRoutes } from '@/utils/defineRoutes';
import { upload } from '@/utils/multer';

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
    middlewares: [
      upload.single('image'), // Processes the multipart/form-data
    ],
    handler: serviceController.createService,
  },
  {
    method: 'patch',
    path: '/:id',
    middlewares: [upload.single('image')],
    handler: serviceController.updateService,
  },
  {
    method: 'delete',
    path: '/:id',
    handler: serviceController.deleteService,
  },
]);

export default serviceRouter;
