import { Router } from 'express';

import validateRequest from '@/app/middlewares/validateRequest';
import { commonSchema } from '@/app/schema/common.schema';
import { authMiddleware } from '../auth/auth.middleware';
import { defineRoutes } from '@/utils/defineRoutes';

import { faqController } from './faq.controller';
import { faqSchema } from './faq.schema';

const faqRouter = Router();

defineRoutes(faqRouter, [
  {
    method: 'get',
    path: '/',
    handler: faqController.getAllFaqs,
  },
  {
    method: 'get',
    path: '/:id',
    middlewares: [validateRequest(commonSchema.idSchema)],
    handler: faqController.getFaqById,
  },
  {
    method: 'post',
    path: '/create',
    middlewares: [
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
      validateRequest(faqSchema.createFaq),
    ],
    handler: faqController.createFaq,
  },
  {
    method: 'patch',
    path: '/:id',
    middlewares: [
      validateRequest(commonSchema.idSchema),
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
      validateRequest(faqSchema.updateFaq),
    ],
    handler: faqController.updateFaq,
  },
  {
    method: 'delete',
    path: '/:id',
    middlewares: [
      validateRequest(commonSchema.idSchema),
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
    ],
    handler: faqController.deleteFaq,
  },
]);

export default faqRouter;
