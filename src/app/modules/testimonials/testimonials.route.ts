import { Router } from 'express';
import { testimonialsController } from './testimonials.controller';
import validateRequest from '@/app/middlewares/validateRequest';
import { testimonialsSchema } from './testimonials.schema';
import { defineRoutes } from '@/utils/defineRoutes';

const testimonialsRouter = Router();

defineRoutes(testimonialsRouter, [
  {
    method: 'post',
    path: '/create',
    middlewares: [validateRequest(testimonialsSchema.createTestimonials)],
    handler: testimonialsController.testimonialsHandler,
  },
  // add other routes as needed
]);

export default testimonialsRouter;
