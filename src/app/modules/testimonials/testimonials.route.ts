import { Router } from 'express';
import { testimonialController } from './testimonials.controller';
import { testimonialSchema } from './testimonials.schema';
import validateRequest from '@/app/middlewares/validateRequest';
import { authMiddleware } from '../auth/auth.middleware';
import { defineRoutes } from '@/utils/defineRoutes';

const testimonialRouter = Router();

defineRoutes(testimonialRouter, [
  {
    method: 'get',
    path: '/',
    handler: testimonialController.getAllTestimonials,
  },
  {
    method: 'post',
    path: '/create',
    middlewares: [
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
      validateRequest(testimonialSchema.createTestimonial),
    ],
    handler: testimonialController.createTestimonial,
  },
  {
    method: 'delete',
    path: '/:id',
    middlewares: [authMiddleware.requireAuth(), authMiddleware.requireAdmin],
    handler: testimonialController.deleteTestimonial,
  },
]);

export default testimonialRouter;
