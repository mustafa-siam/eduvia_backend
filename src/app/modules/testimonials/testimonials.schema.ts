import { z } from 'zod';
const multiLangStringSchema = z.object({
  en: z
    .string({ required_error: 'English translation is required' })
    .min(1, 'English text cannot be empty'),
  bn: z
    .string({ required_error: 'Bangla translation is required' })
    .min(1, 'Bangla text cannot be empty'),
});

const testimonialBodySchema = z.object({
  name: multiLangStringSchema,
  role: multiLangStringSchema,

  // Optional because image path string generation comes from file buffer uploading upload hooks
  img: z.string().url().optional(),

  youtubeLink: z.string({ required_error: 'YouTube link is required' }).url(),
});

const createTestimonial = z.object({
  body: testimonialBodySchema,
});

const updateTestimonial = z.object({
  // Use deep partial variants so updating single locales works safely
  body: z.object({
    name: multiLangStringSchema.partial().optional(),
    role: multiLangStringSchema.partial().optional(),
    img: z.string().url().optional(),
    youtubeLink: z.string().url().optional(),
  }),
});

export const testimonialSchema = {
  createTestimonial,
  updateTestimonial,
};

export type ITestimonial = z.infer<typeof testimonialBodySchema>;
