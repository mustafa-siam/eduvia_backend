import { Router } from 'express';
import { blogController } from './blog.controller';
import validateRequest from '@/app/middlewares/validateRequest';
import { blogSchema } from './blog.schema';
import { defineRoutes } from '@/utils/defineRoutes';
import { authMiddleware } from '../auth/auth.middleware';
import { commonSchema } from '@/app/schema/common.schema';

const blogRouter = Router();

defineRoutes(blogRouter, [
  {
    method: 'get',
    path: '/',
    handler: blogController.getAllBlogs,
  },
  {
    method: 'get',
    path: '/id/:id',
    middlewares: [
      validateRequest(commonSchema.idSchema),
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
    ],
    handler: blogController.getBlogById,
  },
  {
    method: 'get',
    path: '/:slug',
    handler: blogController.getBlogBySlug,
  },
  {
    method: 'post',
    path: '/create',
    middlewares: [
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
      validateRequest(blogSchema.createBlog),
    ],
    handler: blogController.createBlog,
  },
  {
    method: 'patch',
    path: '/:id',
    middlewares: [
      validateRequest(commonSchema.idSchema),
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
      validateRequest(blogSchema.updateBlog),
    ],
    handler: blogController.updateBlog,
  },
  {
    method: 'delete',
    path: '/:id',
    middlewares: [
      validateRequest(commonSchema.idSchema),
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
    ],
    handler: blogController.deleteBlog,
  },
]);

export default blogRouter;
