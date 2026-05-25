import AppError from '@/app/errors/handlers/AppError';
import { StatusCodes } from 'http-status-codes';
import { IBlog } from './blog.schema';
import BlogModel from './blog.model';

/* =========================================================
   CREATE BLOG
========================================================= */
const createBlog = async (payload: IBlog) => {
  return await BlogModel.create({
    ...payload,
    likes: payload.likes ?? 0,
    likedBy: payload.likedBy ?? [],
  });
};

/* =========================================================
   GET ALL BLOGS
========================================================= */
const getAllBlogs = async () => {
  return await BlogModel.find({ isDeleted: { $ne: true } })
    .sort({ createdAt: -1 })
    .lean();
};

/* =========================================================
   TRASHED BLOGS
========================================================= */
const getTrashedBlogs = async () => {
  return await BlogModel.find({ isDeleted: true }).sort({ createdAt: -1 }).lean();
};

/* =========================================================
   GET BLOG BY SLUG
========================================================= */
const getBlogBySlug = async (slug: string) => {
  const blog = await BlogModel.findOne({
    slug,
    isDeleted: { $ne: true },
  }).lean();

  if (!blog) {
    throw new AppError('Blog not found', StatusCodes.NOT_FOUND);
  }

  return blog;
};

/* =========================================================
   GET BLOG BY ID
========================================================= */
const getBlogById = async (id: string) => {
  const blog = await BlogModel.findById(id).lean();

  if (!blog) {
    throw new AppError('Blog not found', StatusCodes.NOT_FOUND);
  }

  return blog;
};

/* =========================================================
   UPDATE BLOG
========================================================= */
const updateBlog = async (id: string, payload: Partial<IBlog>) => {
  const updated = await BlogModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updated) {
    throw new AppError('Blog not found', StatusCodes.NOT_FOUND);
  }

  return updated;
};

/* =========================================================
   SOFT DELETE
========================================================= */
const deleteBlog = async (id: string) => {
  const deleted = await BlogModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).lean();

  if (!deleted) {
    throw new AppError('Blog not found', StatusCodes.NOT_FOUND);
  }

  return deleted;
};

/* =========================================================
   RESTORE BLOG
========================================================= */
const restoreBlog = async (id: string) => {
  const restored = await BlogModel.findByIdAndUpdate(
    id,
    { isDeleted: false },
    { new: true }
  ).lean();

  if (!restored) {
    throw new AppError('Blog not found', StatusCodes.NOT_FOUND);
  }

  return restored;
};

/* =========================================================
   PERMANENT DELETE
========================================================= */
const permanentDeleteBlog = async (id: string) => {
  const deleted = await BlogModel.findByIdAndDelete(id).lean();

  if (!deleted) {
    throw new AppError('Blog not found', StatusCodes.NOT_FOUND);
  }

  return deleted;
};

/* =========================================================
   LIKE BLOG (ONE DEVICE = ONE LIKE, NO UNLIKE)
   - deviceId comes from frontend localStorage (anon-device-id)
   - likedBy[] tracks which devices have liked
   - Once liked, the same deviceId cannot like again
   - Frontend also guards with localStorage 'liked-{slug}'
   - Both layers together make it bulletproof
========================================================= */
const likeBlog = async (slug: string, deviceId: string) => {
  const blog = await BlogModel.findOne({
    slug,
    isDeleted: { $ne: true },
  });

  if (!blog) {
    throw new AppError('Blog not found', StatusCodes.NOT_FOUND);
  }

  // Normalize defensively
  blog.likedBy = blog.likedBy ?? [];
  blog.likes = blog.likes ?? 0;

  // Check if this device has already liked
  const alreadyLiked = blog.likedBy.includes(deviceId);

  if (alreadyLiked) {
    // Device already liked — do nothing, just return current state
    // Frontend localStorage prevents reaching here in normal flow,
    // but this is the backend safety net
    return blog.toObject();
  }

  // New like — register device and increment count
  blog.likedBy.push(deviceId);
  blog.likes += 1;

  await blog.save();

  return blog.toObject();
};

/* =========================================================
   EXPORT
========================================================= */
export const blogService = {
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
