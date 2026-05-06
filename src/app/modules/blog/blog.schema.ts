import { z } from 'zod';

const blogBodySchema = z.object({
  slug: z.string().min(1, 'Blog slug is required'),
  title: z.string().min(1, 'Blog title is required'),
  excerpt: z.string().min(1, 'Blog excerpt is required'),
  category: z.string().min(1, 'Blog category is required'),
  author: z.string().min(1, 'Blog author is required'),
  authorRole: z.string().min(1, 'Blog author role is required'),
  date: z.string().min(1, 'Blog publish date is required'),
  readTime: z.string().min(1, 'Blog read time is required'),
  content: z.string().min(1, 'Blog content is required'),
  // Cover is handled via file upload, so it's optional in the initial validation
  cover: z.string().optional(),
});

const createBlog = z.object({
  body: blogBodySchema,
});

const updateBlog = z.object({
  body: blogBodySchema.partial(),
});

export const blogSchema = {
  createBlog,
  updateBlog,
};

export type IBlog = z.infer<typeof blogBodySchema>;
