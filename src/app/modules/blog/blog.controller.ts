import catchAsync from '@/utils/catchAsync';
import { blogService } from './blog.service';
import { sendSuccessResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';
import { cloudinaryConfig } from '@/utils/uploadFile';
import AppError from '@/app/errors/handlers/AppError';

/* =========================================================
   CREATE BLOG
========================================================= */
const createBlog = catchAsync(async (req, res) => {
  let coverUrl = '';

  if (req.file) {
    const uploadResult = await cloudinaryConfig.uploadFileToCloudinary(
      req.file.buffer,
      req.file.originalname,
      { folder: 'blogs' }
    );
    coverUrl = uploadResult.secure_url;
  }

  const data = await blogService.createBlog({
    ...req.body,
    cover: coverUrl,
  });

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Blog created successfully',
    data,
  });
});

/* =========================================================
   GET ALL BLOGS
========================================================= */
const getAllBlogs = catchAsync(async (_req, res) => {
  const data = await blogService.getAllBlogs();

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Blogs fetched successfully',
    data,
  });
});

/* =========================================================
   GET TRASHED BLOGS
========================================================= */
const getTrashedBlogs = catchAsync(async (_req, res) => {
  const data = await blogService.getTrashedBlogs();

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Trashed blogs fetched successfully',
    data,
  });
});

/* =========================================================
   GET BLOG BY SLUG
========================================================= */
const getBlogBySlug = catchAsync(async (req, res) => {
  const data = await blogService.getBlogBySlug(req.params.slug);

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Blog fetched successfully',
    data,
  });
});

/* =========================================================
   GET BLOG BY ID
========================================================= */
const getBlogById = catchAsync(async (req, res) => {
  const data = await blogService.getBlogById(req.params.id);

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Blog fetched successfully',
    data,
  });
});

/* =========================================================
   UPDATE BLOG
========================================================= */
const updateBlog = catchAsync(async (req, res) => {
  const payload = { ...req.body };

  if (req.file) {
    const uploadResult = await cloudinaryConfig.uploadFileToCloudinary(
      req.file.buffer,
      req.file.originalname,
      { folder: 'blogs' }
    );
    payload.cover = uploadResult.secure_url;
  }

  const data = await blogService.updateBlog(req.params.id, payload);

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Blog updated successfully',
    data,
  });
});

/* =========================================================
   DELETE BLOG (SOFT)
========================================================= */
const deleteBlog = catchAsync(async (req, res) => {
  const data = await blogService.deleteBlog(req.params.id);

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Blog moved to trash',
    data,
  });
});

/* =========================================================
   RESTORE BLOG
========================================================= */
const restoreBlog = catchAsync(async (req, res) => {
  const data = await blogService.restoreBlog(req.params.id);

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Blog restored successfully',
    data,
  });
});

/* =========================================================
   PERMANENT DELETE BLOG
========================================================= */
const permanentDeleteBlog = catchAsync(async (req, res) => {
  const data = await blogService.permanentDeleteBlog(req.params.id);

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Blog permanently deleted',
    data,
  });
});

/* =========================================================
   LIKE / UNLIKE BLOG (ANONYMOUS DEVICE INTERACTION)
========================================================= */
const likeBlog = catchAsync(async (req, res) => {
  // 1. Destructure from req.body instead of reading Clerk tokens
  const { slug, userId } = req.body;

  if (!slug || !userId) {
    throw new AppError(
      'Bad Request - Missing slug or tracking device ID properties',
      StatusCodes.BAD_REQUEST
    );
  }

  // 2. Pass variables downstream to your business service layer
  const data = await blogService.likeBlog(slug, userId);

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Blog reaction status synchronized successfully',
    data,
  });
});

/* =========================================================
   EXPORT CONTROLLER
========================================================= */
export const blogController = {
  createBlog,
  getAllBlogs,
  getTrashedBlogs,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  deleteBlog,
  restoreBlog,
  permanentDeleteBlog,
  likeBlog,
};
