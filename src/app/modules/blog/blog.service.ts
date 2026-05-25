import AppError from '@/app/errors/handlers/AppError';
import { StatusCodes } from 'http-status-codes';
import { IBlog } from './blog.schema';
import BlogModel from './blog.model';

const createBlog = async (payload: IBlog) => {
  return await BlogModel.create({
    ...payload,
    likes: payload.likes ?? 0,
    likedBy: payload.likedBy ?? [],
  });
};

const getAllBlogs = async () => {
  return await BlogModel.find({ isDeleted: { $ne: true } })
    .sort({ createdAt: -1 })
    .lean();
};

const getTrashedBlogs = async () => {
  return await BlogModel.find({ isDeleted: true }).sort({ createdAt: -1 }).lean();
};

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

const getBlogById = async (id: string) => {
  const blog = await BlogModel.findById(id).lean();

  if (!blog) {
    throw new AppError('Blog not found', StatusCodes.NOT_FOUND);
  }

  return blog;
};

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

const deleteBlog = async (id: string) => {
  const deleted = await BlogModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).lean();

  if (!deleted) {
    throw new AppError('Blog not found', StatusCodes.NOT_FOUND);
  }

  return deleted;
};

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

const permanentDeleteBlog = async (id: string) => {
  const deleted = await BlogModel.findByIdAndDelete(id).lean();

  if (!deleted) {
    throw new AppError('Blog not found', StatusCodes.NOT_FOUND);
  }

  return deleted;
};

/* =========================================================
   TOGGLE LIKE (ONE DEVICE = TOGGLE LIKE/UNLIKE)
   - deviceId from frontend localStorage 'anon-device-id'
   - likedBy[] tracks which devices have liked
   - If deviceId in likedBy[] → unlike (remove + decrement)
   - If deviceId not in likedBy[] → like (add + increment)
   - Returns { blog, isLiked } so frontend knows current state
========================================================= */
const toggleLikeBlog = async (slug: string, deviceId: string) => {
  const blog = await BlogModel.findOne({
    slug,
    isDeleted: { $ne: true },
  });

  if (!blog) {
    throw new AppError('Blog not found', StatusCodes.NOT_FOUND);
  }

  blog.likedBy = blog.likedBy ?? [];
  blog.likes = blog.likes ?? 0;

  const alreadyLiked = blog.likedBy.includes(deviceId);

  if (alreadyLiked) {
    // Unlike: remove deviceId and decrement
    blog.likedBy = blog.likedBy.filter((id) => id !== deviceId);
    blog.likes = Math.max(0, blog.likes - 1);
  } else {
    // Like: add deviceId and increment
    blog.likedBy.push(deviceId);
    blog.likes += 1;
  }

  await blog.save();

  return {
    blog: blog.toObject(),
    isLiked: !alreadyLiked, // true = just liked, false = just unliked
  };
};

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
  toggleLikeBlog,
};
