import { Router } from 'express';
import { userController } from './user.controller';
import { defineRoutes } from '@/utils/defineRoutes';
import { authMiddleware } from '../auth/auth.middleware';
import { userSchema } from './user.schema';
import validateRequest from '@/app/middlewares/validateRequest';

const userRouter = Router();

defineRoutes(userRouter, [
  /**
   * GET /api/v1/users/role
   * Get current user role (Any authenticated user can access)
   */
  {
    method: 'get',
    path: '/role',
    middlewares: [authMiddleware.requireAuth()],
    handler: userController.getUserRole,
  },

  /**
   * GET /api/v1/users/me
   * Get logged in user
   */

  {
    method: 'get',
    path: '/me',
    middlewares: [authMiddleware.requireAuth()],
    handler: userController.getLoggedInUser,
  },

  /**
   * GET /api/v1/users/stats
   * Get system statistics (Admin only)
   */
  {
    method: 'get',
    path: '/stats',
    middlewares: [authMiddleware.requireAuth(), authMiddleware.requireAdmin],
    handler: userController.statisticsHandler,
  },

  /**
   * GET /api/v1/users/export
   * Export user information (Admin only)
   * ⚠️ MUST come BEFORE /users/ route
   */
  {
    method: 'get',
    path: '/export',
    handler: userController.exportUsersHandler,
  },

  /**
   * PUT /api/v1/users/update/:id
   * Update user basic info
   */
  {
    method: 'put',
    path: '/update/:id',
    middlewares: [authMiddleware.requireAuth()],
    handler: userController.userUpdateHandler,
  },

  /**
   * GET /api/v1/users
   * Get all users (Admin only)
   */
  {
    method: 'get',
    path: '/',
    middlewares: [authMiddleware.requireAuth(), authMiddleware.requireAdmin],
    handler: userController.getAllUsersHandler,
  },

  /**
   * PUT /api/v1/users/:id/role
   * Update user role (Admin only)
   * ⚠️ Must come BEFORE /users/:id
   */
  {
    method: 'put',
    path: '/:id/role',
    middlewares: [authMiddleware.requireAuth(), authMiddleware.requireAdmin],
    handler: userController.updateUserRoleHandler,
  },

  /**
   * GET /api/v1/users/:id
   * Get specific user by ID (Admin only)
   */
  {
    method: 'get',
    path: '/:id',
    middlewares: [authMiddleware.requireAuth(), authMiddleware.requireAdmin],
    handler: userController.getSingleUserHandler,
  },

  /**
   * DELETE /api/v1/users/:id
   * Delete user (Admin only)
   */
  {
    method: 'delete',
    path: '/:id',
    middlewares: [authMiddleware.requireAuth(), authMiddleware.requireAdmin],
    handler: userController.deleteUserHandler,
  },

  /**
   * DELETE /api/v1/users/delete-from-clerk
   * Delete user from Clerk (Admin only)
   */
  {
    method: 'delete',
    path: '/delete-from-clerk',
    middlewares: [
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
      validateRequest(userSchema.deleteUserFromClerk),
    ],
    handler: userController.handleDeleteUserFromClerk,
  },

  /**
   * PUT /api/v1/users/permissions
   * Update user permissions (Admin only)
   */
  {
    method: 'put',
    path: '/permissions',
    middlewares: [
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
      validateRequest(userSchema.updateUserPermissions),
    ],
    handler: userController.userPermissionHandler,
  },
]);

export default userRouter;
