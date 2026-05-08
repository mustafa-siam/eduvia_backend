import { Router } from 'express';
import { blogController } from './blog.controller';
import validateRequest from '@/app/middlewares/validateRequest';
import { blogSchema } from './blog.schema';
import { defineRoutes } from '@/utils/defineRoutes';
import { authMiddleware } from '../auth/auth.middleware';
import { commonSchema } from '@/app/schema/common.schema';
import { upload } from '@/utils/multer';

const blogRouter = Router();

defineRoutes(blogRouter, [
  {
    method: 'get',
    path: '/',
    handler: blogController.getAllBlogs,
  },
  {
    method: 'get',
    path: '/trash',
    middlewares: [authMiddleware.requireAuth(), authMiddleware.requireAdmin],
    handler: blogController.getTrashedBlogs,
  },
  {
    method: 'post',
    path: '/create',
    middlewares: [
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
      upload.single('cover'),
      validateRequest(blogSchema.createBlog),
    ],
    handler: blogController.createBlog,
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
    method: 'patch',
    path: '/:id/restore',
    middlewares: [
      validateRequest(commonSchema.idSchema),
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
    ],
    handler: blogController.restoreBlog,
  },
  {
    method: 'delete',
    path: '/:id/permanent',
    middlewares: [
      validateRequest(commonSchema.idSchema),
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
    ],
    handler: blogController.permanentDeleteBlog,
  },
  {
    method: 'patch',
    path: '/:id',
    middlewares: [
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
      upload.single('cover'),
      validateRequest(commonSchema.idSchema),
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
  {
    method: 'get',
    path: '/:slug',
    handler: blogController.getBlogBySlug,
  },
]);

export default blogRouter;
