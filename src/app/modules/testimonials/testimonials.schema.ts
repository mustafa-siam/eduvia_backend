import { z } from 'zod';

const testimonialBodySchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(1),
  role: z.string({ required_error: 'Role is required' }).min(1),

  // now optional because image comes from file upload
  img: z.string().url().optional(),

  youtubeLink: z.string({ required_error: 'YouTube link is required' }).url(),
});

const createTestimonial = z.object({
  body: testimonialBodySchema,
});

const updateTestimonial = z.object({
  body: testimonialBodySchema.partial(),
});

export const testimonialSchema = {
  createTestimonial,
  updateTestimonial,
};

export type ITestimonial = z.infer<typeof testimonialBodySchema>;
