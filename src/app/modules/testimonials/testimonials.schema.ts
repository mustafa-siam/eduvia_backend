import { z } from 'zod';

const createTestimonials = z.object({
  body: z.object({
    name: z.string({ required_error: 'Testimonials name is required' }),
  }),
});

// Add other schemas here as needed
// export const updateTestimonials = z.object({...});

export const testimonialsSchema = {
  createTestimonials,
  // updateTestimonials,
};

// Type export for mongoose schema
export type ITestimonials = z.infer<typeof createTestimonials>['body'];
