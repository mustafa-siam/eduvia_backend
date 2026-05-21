import { Schema, model, Document } from 'mongoose';
import { IBlog } from './blog.schema';

type IBlogDocument = IBlog & { isDeleted?: boolean } & Document;

const localizedStringSchema = new Schema(
  {
    en: { type: String, required: true, trim: true },
    bn: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const blogSchema = new Schema<IBlogDocument>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: localizedStringSchema,
      required: true,
    },
    excerpt: {
      type: localizedStringSchema,
      required: true,
    },
    cover: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: localizedStringSchema,
      required: true,
    },
    author: {
      type: localizedStringSchema,
      required: true,
    },
    authorRole: {
      type: localizedStringSchema,
      required: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    readTime: {
      type: String,
      trim: true,
      default: '',
    },
    content: {
      type: localizedStringSchema,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    likedBy: {
      type: [String],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

blogSchema.index({ slug: 1 });
blogSchema.index({ createdAt: -1 });

const BlogModel = model<IBlogDocument>('Blog', blogSchema);

export default BlogModel;
