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
  /* =====================================================
     PUBLIC ROUTES
  ===================================================== */

  {
    method: 'get',
    path: '/',
    handler: blogController.getAllBlogs,
  },

  /* =====================================================
     ADMIN ROUTES — must come BEFORE /:slug to avoid
     Express matching "trash" or "create" as a slug
  ===================================================== */

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

  /* =====================================================
     🆕 LIKE / UNLIKE (ANONYMOUS & PUBLIC)
     Kept before /:slug so Express doesn't treat 'like' as a slug parameter
  ===================================================== */

  {
    method: 'patch',
    path: '/like',
    middlewares: [
      validateRequest(blogSchema.toggleLikeSchema), // Ensures payload contains valid slug and userId
    ],
    handler: blogController.likeBlog,
  },

  /* =====================================================
     PUBLIC SLUG ROUTE — after all static paths
  ===================================================== */

  {
    method: 'get',
    path: '/:slug',
    handler: blogController.getBlogBySlug,
  },

  /* =====================================================
     ADMIN ID-BASED ROUTES
  ===================================================== */

  {
    method: 'get',
    path: '/id/:id',
    middlewares: [
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
      validateRequest(commonSchema.idSchema),
    ],
    handler: blogController.getBlogById,
  },

  {
    method: 'patch',
    path: '/id/:id',
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
    path: '/id/:id',
    middlewares: [
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
      validateRequest(commonSchema.idSchema),
    ],
    handler: blogController.deleteBlog,
  },

  {
    method: 'patch',
    path: '/id/:id/restore',
    middlewares: [
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
      validateRequest(commonSchema.idSchema),
    ],
    handler: blogController.restoreBlog,
  },

  {
    method: 'delete',
    path: '/id/:id/permanent',
    middlewares: [
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
      validateRequest(commonSchema.idSchema),
    ],
    handler: blogController.permanentDeleteBlog,
  },
]);

export default blogRouter;
