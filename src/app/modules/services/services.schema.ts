import { z } from 'zod';

const serviceBodySchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  title: z.string().min(1, 'Title is required'),
  desc: z.string().min(1, 'Description is required'),
  image: z.string().min(1, 'Image is required'),
  content: z.array(z.string()).optional(),
});

const createService = z.object({
  body: serviceBodySchema,
});

const updateService = z.object({
  body: serviceBodySchema.partial(),
});

export const serviceSchema = {
  createService,
  updateService,
};

export type IService = z.infer<typeof serviceBodySchema>;
