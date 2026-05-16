import { z } from 'zod';

/* =========================================================
    MAIN DATA OBJECT VALIDATOR (ZOD SCHEMA)
========================================================= */
export const blogBodySchema = z.object({
  slug: z.string().min(1, 'Blog slug is required'),
  title: z.string().min(1, 'Blog title is required'),
  excerpt: z.string().min(1, 'Blog excerpt is required'),
  category: z.string().min(1, 'Blog category is required'),
  author: z.string().min(1, 'Blog author is required'),
  authorRole: z.string().min(1, 'Blog author role is required'),
  date: z.string().min(1, 'Blog publish date is required'),
  readTime: z.string().min(1, 'Blog read time is required'),
  content: z.string().min(1, 'Blog content is required'),
  cover: z.string().min(1, 'Blog cover image URL is required'),
  likes: z.number().int().nonnegative().default(0),
  likedBy: z.array(z.string()).default([]),
});

/* =========================================================
    MIDDLEWARE ROUTE VALIDATOR TEMPLATES
========================================================= */
const createBlog = z.object({
  body: blogBodySchema,
});

const updateBlog = z.object({
  body: blogBodySchema.partial(),
});

const toggleLikeSchema = z.object({
  body: z.object({
    slug: z.string().min(1, 'Blog slug is required'),
    userId: z.string().min(1, 'Anonymous User/Device ID is required'),
  }),
});

export const blogSchema = {
  createBlog,
  updateBlog,
  toggleLikeSchema,
};

/* =========================================================
    EXPORTS FOR TYPE SAFETY (COMPATIBLE WITH MONGOOSE)
========================================================= */
export type IBlog = z.infer<typeof blogBodySchema>;

export interface BlogPostFormValues {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  content: string;
  cover: string;
}

export type BlogPayload = Omit<IBlog, 'likes' | 'likedBy'>;

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}
