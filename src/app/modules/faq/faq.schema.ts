import { z } from 'zod';

const faqBodySchema = z.object({
  question: z.string({ required_error: 'Question is required' }).min(1),
  answer: z.string({ required_error: 'Answer is required' }).min(1),
});

const createFaq = z.object({
  body: faqBodySchema,
});

const updateFaq = z.object({
  body: faqBodySchema.partial(),
});

export const faqSchema = {
  createFaq,
  updateFaq,
};

export type IFaq = z.infer<typeof faqBodySchema>;
