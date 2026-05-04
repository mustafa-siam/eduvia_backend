import AppError from '@/app/errors/handlers/AppError';
import { StatusCodes } from 'http-status-codes';
import { IBlog } from './blog.schema';
import BlogModel from './blog.model';

const createBlog = async (payload: IBlog) => {
  const created = await BlogModel.create(payload);
  return created;
};

const getAllBlogs = async () => {
  const blogs = await BlogModel.find().sort({ createdAt: -1 }).lean();
  return blogs;
};

const getBlogBySlug = async (slug: string) => {
  const blog = await BlogModel.findOne({ slug }).lean();

  if (!blog) {
    throw new AppError('Blog not found', StatusCodes.NOT_FOUND);
  }

  return blog;
};

const getBlogById = async (id: string) => {
  const blog = await BlogModel.findById(id).lean();

  if (!blog) {
    throw new AppError('Blog not found', StatusCodes.NOT_FOUND);
  }

  return blog;
};

const updateBlog = async (id: string, payload: IBlog) => {
  const updated = await BlogModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updated) {
    throw new AppError('Blog not found', StatusCodes.NOT_FOUND);
  }

  return updated;
};

const deleteBlog = async (id: string) => {
  const deleted = await BlogModel.findByIdAndDelete(id).lean();

  if (!deleted) {
    throw new AppError('Blog not found', StatusCodes.NOT_FOUND);
  }

  return deleted;
};

export const blogService = {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  deleteBlog,
};
