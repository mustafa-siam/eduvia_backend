import catchAsync from '@/utils/catchAsync';
import { blogService } from './blog.service';
import { sendSuccessResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';

export const createBlog = catchAsync(async (req, res) => {
  const data = await blogService.createBlog(req.body);
  sendSuccessResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Blog created successfully',
    data,
  });
});

export const getAllBlogs = catchAsync(async (_req, res) => {
  const data = await blogService.getAllBlogs();

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Blogs fetched successfully',
    data,
  });
});

export const getBlogBySlug = catchAsync(async (req, res) => {
  const data = await blogService.getBlogBySlug(req.params.slug);

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Blog fetched successfully',
    data,
  });
});

export const blogController = {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
};
