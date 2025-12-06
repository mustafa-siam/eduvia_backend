import { Router } from 'express';
import { authController } from './auth.controller';

import { defineRoutes } from '@/utils/defineRoutes';
import { authMiddleware } from './auth.middleware';

const authRouter = Router();

defineRoutes(authRouter, [
  /**
   * POST /api/v1/auth/clerk-webhook
   * Handle Clerk webhook events
   * Note: This route must use raw body parser
   */
  {
    method: 'post',
    path: '/clerk-webhook',
    handler: authController.handleClerkWebhook,
  },
  /**
   * GET /api/v1/auth/protected
   * Example protected route
   */
  {
    method: 'get',
    path: '/protected',
    middlewares: [authMiddleware.requireAuth()],
    handler: authController.protectedHandler,
  },
  // add other routes as needed
]);

export default authRouter;
