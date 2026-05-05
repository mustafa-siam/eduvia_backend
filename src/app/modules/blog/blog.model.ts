import { Schema, model, Document } from 'mongoose';
import { IBlog } from './blog.schema';

const blogSchema = new Schema<IBlog & Document>(
  {
    // unique: true already creates an index, so we don't need the extra line below
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    cover: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    authorRole: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    readTime: { type: String, required: true, trim: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

// REMOVED: blogSchema.index({ slug: 1 }, { unique: true });
// This line was causing the "Duplicate schema index" warning.

const BlogModel = model<IBlog & Document>('Blog', blogSchema);
export default BlogModel;
