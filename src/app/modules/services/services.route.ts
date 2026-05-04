import { Router } from 'express';
import { servicesController } from './services.controller';
import validateRequest from '@/app/middlewares/validateRequest';
import { servicesSchema } from './services.schema';
import { defineRoutes } from '@/utils/defineRoutes';

const servicesRouter = Router();

defineRoutes(servicesRouter, [
  {
    method: 'post',
    path: '/create',
    middlewares: [validateRequest(servicesSchema.createServices)],
    handler: servicesController.servicesHandler,
  },
  // add other routes as needed
]);

export default servicesRouter;
