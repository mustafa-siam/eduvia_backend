import { Router } from 'express';
import { testimonialController } from './testimonials.controller';
import { testimonialSchema } from './testimonials.schema';
import validateRequest from '@/app/middlewares/validateRequest';
import { authMiddleware } from '../auth/auth.middleware';
import { defineRoutes } from '@/utils/defineRoutes';
import { upload } from '@/utils/multer';

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
      upload.single('img'),
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
      validateRequest(testimonialSchema.createTestimonial),
    ],
    handler: testimonialController.createTestimonial,
  },
  {
    // ✅ ADDED UPDATE ROUTE
    method: 'patch',
    path: '/:id',
    middlewares: [
      upload.single('img'), // Required to parse FormData/Files
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
      validateRequest(testimonialSchema.updateTestimonial), // Ensure this exists in your schema
    ],
    handler: testimonialController.updateTestimonial,
  },
  {
    method: 'delete',
    path: '/:id',
    middlewares: [authMiddleware.requireAuth(), authMiddleware.requireAdmin],
    handler: testimonialController.deleteTestimonial,
  },
]);

export default testimonialRouter;
