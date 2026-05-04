import { z } from 'zod';

const blogBodySchema = z.object({
  slug: z.string({ required_error: 'Blog slug is required' }).min(1, 'Blog slug is required'),
  title: z.string({ required_error: 'Blog title is required' }).min(1, 'Blog title is required'),
  excerpt: z
    .string({ required_error: 'Blog excerpt is required' })
    .min(1, 'Blog excerpt is required'),
  cover: z.string({ required_error: 'Blog cover is required' }).min(1, 'Blog cover is required'),
  category: z
    .string({ required_error: 'Blog category is required' })
    .min(1, 'Blog category is required'),
  author: z.string({ required_error: 'Blog author is required' }).min(1, 'Blog author is required'),
  authorRole: z
    .string({ required_error: 'Blog author role is required' })
    .min(1, 'Blog author role is required'),
  date: z.string({ required_error: 'Blog publish date is required' }).min(1),
  readTime: z.string({ required_error: 'Blog read time is required' }).min(1),
  content: z
    .array(z.string().min(1, 'Each paragraph must be a non-empty string'), {
      required_error: 'Blog content is required',
    })
    .min(1, 'Blog content is required'),
});

const createBlog = z.object({
  body: blogBodySchema,
});

const updateBlog = z.object({
  body: blogBodySchema,
});

export const blogSchema = {
  createBlog,
  updateBlog,
};

// Type export for mongoose schema
export type IBlog = z.infer<typeof createBlog>['body'];
