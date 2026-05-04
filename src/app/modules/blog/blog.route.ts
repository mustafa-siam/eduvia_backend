import { Router } from 'express';
import { blogController } from './blog.controller';
import validateRequest from '@/app/middlewares/validateRequest';
import { blogSchema } from './blog.schema';
import { defineRoutes } from '@/utils/defineRoutes';

const blogRouter = Router();

defineRoutes(blogRouter, [
  {
    method: 'get',
    path: '/',
    handler: blogController.getAllBlogs,
  },
  {
    method: 'get',
    path: '/:slug',
    handler: blogController.getBlogBySlug,
  },
  {
    method: 'post',
    path: '/create',
    middlewares: [validateRequest(blogSchema.createBlog)],
    handler: blogController.createBlog,
  },
]);

export default blogRouter;
