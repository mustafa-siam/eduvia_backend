import { z } from 'zod';

const createServices = z.object({
  body: z.object({
    name: z.string({ required_error: 'Services name is required' }),
  }),
});

// Add other schemas here as needed
// export const updateServices = z.object({...});

export const servicesSchema = {
  createServices,
  // updateServices,
};

// Type export for mongoose schema
export type IServices = z.infer<typeof createServices>['body'];
