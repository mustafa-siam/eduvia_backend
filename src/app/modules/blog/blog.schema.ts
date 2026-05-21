import { z } from 'zod';

const localizedStringSchema = z.object({
  en: z.string().min(1, 'English translation content is required'),
  bn: z.string().min(1, 'Bengali translation content is required'),
});

export const blogBodySchema = z.object({
  slug: z.string().min(1, 'Blog slug is required'),
  title: localizedStringSchema,
  excerpt: localizedStringSchema,
  category: localizedStringSchema,
  author: localizedStringSchema,
  authorRole: localizedStringSchema,
  date: z.string().min(1, 'Blog publish date is required'),
  readTime: z.string().optional(),
  content: localizedStringSchema,
  cover: z.string().optional(),
  likes: z.number().int().nonnegative().default(0),
  likedBy: z.array(z.string()).default([]),
});

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

export type IBlog = z.infer<typeof blogBodySchema>;

export type BlogPayload = Omit<IBlog, 'likes' | 'likedBy'>;

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}
