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

export const blogService = {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
};
