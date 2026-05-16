import { Schema, model, Document } from 'mongoose';
import { IBlog } from './blog.schema';

const blogSchema = new Schema<IBlog & Document>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    cover: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    authorRole: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    readTime: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    likedBy: {
      type: [String], // Stores anonymous generated device IDs securely
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* =====================================================
    DATABASE INDEX OPTIMIZATIONS
===================================================== */
blogSchema.index({ slug: 1 });
blogSchema.index({ createdAt: -1 });

const BlogModel = model<IBlog & Document>('Blog', blogSchema);

export default BlogModel;
