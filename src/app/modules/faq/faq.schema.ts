import { z } from 'zod';

const localizedStringSchema = z.object({
  en: z
    .string({ required_error: 'English content is required' })
    .min(1, 'English content cannot be empty'),
  bn: z
    .string({ required_error: 'Bangla content is required' })
    .min(1, 'Bangla content cannot be empty'),
});

const faqBodySchema = z.object({
  question: localizedStringSchema,
  answer: localizedStringSchema,
});

const createFaq = z.object({
  body: faqBodySchema,
});

const updateFaq = z.object({
  body: z
    .object({
      question: localizedStringSchema.partial(),
      answer: localizedStringSchema.partial(),
    })
    .partial(),
});

export const faqSchema = {
  createFaq,
  updateFaq,
};

export type IFaq = z.infer<typeof faqBodySchema>;
