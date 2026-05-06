import catchAsync from '@/utils/catchAsync';
import { blogService } from './blog.service';
import { sendSuccessResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';
import { cloudinaryConfig } from '@/utils/uploadFile';

const createBlog = catchAsync(async (req, res) => {
  let coverUrl = '';
  if (req.file) {
    const uploadResult = await cloudinaryConfig.uploadFileToCloudinary(
      req.file.buffer, // File buffer from memoryStorage
      req.file.originalname, // Original name to detect file type
      { folder: 'blogs' } // Custom folder option
    );
    coverUrl = uploadResult.secure_url;
  }

  // 2. Combine uploaded URL with the rest of req.body
  const data = await blogService.createBlog({
    ...req.body,
    cover: coverUrl,
  });

  sendSuccessResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Blog created successfully',
    data,
  });
});

const getAllBlogs = catchAsync(async (_req, res) => {
  const data = await blogService.getAllBlogs();
  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Blogs fetched successfully',
    data,
  });
});

const getBlogBySlug = catchAsync(async (req, res) => {
  const data = await blogService.getBlogBySlug(req.params.slug);
  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Blog fetched successfully',
    data,
  });
});

const getBlogById = catchAsync(async (req, res) => {
  const data = await blogService.getBlogById(req.params.id);
  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Blog fetched successfully',
    data,
  });
});

const updateBlog = catchAsync(async (req, res) => {
  const payload = { ...req.body };

  // 1. If a new file is uploaded, update the cover URL
  if (req.file) {
    const uploadResult = await cloudinaryConfig.uploadFileToCloudinary(
      req.file.buffer,
      req.file.originalname,
      { folder: 'blogs' }
    );
    payload.cover = uploadResult.secure_url;
  }

  // 2. Perform the update
  const data = await blogService.updateBlog(req.params.id, payload);

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Blog updated successfully',
    data,
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  // Optional: You could extract the public_id from the blog's cover URL
  // and delete it from Cloudinary here before deleting from DB.

  const data = await blogService.deleteBlog(req.params.id);
  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Blog deleted successfully',
    data,
  });
});

export const blogController = {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  deleteBlog,
};
