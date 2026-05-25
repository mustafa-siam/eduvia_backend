import catchAsync from '@/utils/catchAsync';
import { blogService } from './blog.service';
import { sendSuccessResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';
import { cloudinaryConfig } from '@/utils/uploadFile';
import AppError from '@/app/errors/handlers/AppError';

const parseLocalizedPayload = (body: any) => {
  const payload = { ...body };
  const localizedFields = ['title', 'excerpt', 'content', 'category', 'author', 'authorRole'];

  for (const field of localizedFields) {
    const value = payload[field];
    if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
      try {
        payload[field] = JSON.parse(value);
      } catch {}
    } else if (!value) {
      const en = body[`${field}.en`];
      const bn = body[`${field}.bn`];
      if (en !== undefined || bn !== undefined) {
        payload[field] = { en: en || '', bn: bn || '' };
      }
    }
  }

  return payload;
};

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

  const normalizedBody = parseLocalizedPayload(req.body);

  const data = await blogService.createBlog({
    ...normalizedBody,
    cover: coverUrl,
  });

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Blog created successfully',
    data,
  });
});

const getAllBlogs = catchAsync(async (_req, res) => {
  const data = await blogService.getAllBlogs();

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Blogs fetched successfully',
    data,
  });
});

const getTrashedBlogs = catchAsync(async (_req, res) => {
  const data = await blogService.getTrashedBlogs();

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Trashed blogs fetched successfully',
    data,
  });
});

const getBlogBySlug = catchAsync(async (req, res) => {
  const data = await blogService.getBlogBySlug(req.params.slug);

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Blog fetched successfully',
    data,
  });
});

const getBlogById = catchAsync(async (req, res) => {
  const data = await blogService.getBlogById(req.params.id);

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Blog fetched successfully',
    data,
  });
});

const updateBlog = catchAsync(async (req, res) => {
  const payload = parseLocalizedPayload(req.body);

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

const deleteBlog = catchAsync(async (req, res) => {
  const data = await blogService.deleteBlog(req.params.id);

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Blog moved to trash',
    data,
  });
});

const restoreBlog = catchAsync(async (req, res) => {
  const data = await blogService.restoreBlog(req.params.id);

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Blog restored successfully',
    data,
  });
});

const permanentDeleteBlog = catchAsync(async (req, res) => {
  const data = await blogService.permanentDeleteBlog(req.params.id);

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Blog permanently deleted',
    data,
  });
});

/* =========================================================
   TOGGLE LIKE (ANONYMOUS — ONE DEVICE TOGGLE LIKE/UNLIKE)
   - slug: identifies the blog post
   - userId: persistent anonymous device ID from frontend localStorage
   - Returns blog data + isLiked boolean so frontend stays in sync
========================================================= */
const likeBlog = catchAsync(async (req, res) => {
  const { slug, userId } = req.body;

  if (!slug || !userId) {
    throw new AppError(
      'Bad Request - Missing slug or tracking device ID properties',
      StatusCodes.BAD_REQUEST
    );
  }

  const { blog, isLiked } = await blogService.toggleLikeBlog(slug, userId);

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: isLiked ? 'Blog liked successfully' : 'Blog unliked successfully',
    data: { ...blog, isLiked },
  });
});

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
