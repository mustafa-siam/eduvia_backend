import { z } from 'zod';

const serviceBodySchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  title: z.string().min(1, 'Title is required'),
  desc: z.string().min(1, 'Description is required'),
  // FIX 1: Change array to string to match Mongoose & Rich Text Editor
  content: z.string().optional(),
  // FIX 2: Make image optional in Zod because Multer handles the file separately
  // We will manually check for the file in the controller
  image: z.string().optional(),
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
