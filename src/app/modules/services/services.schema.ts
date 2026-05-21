import { z } from 'zod';

// Reusable schema for localized fields
const localizedStringSchema = z.object({
  en: z.string().min(1, 'English version is required'),
  bn: z.string().min(1, 'Bengali version is required'),
});

const serviceBodySchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  title: localizedStringSchema,
  desc: localizedStringSchema,
  content: localizedStringSchema,
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

export type IServiceInput = z.infer<typeof serviceBodySchema>;
