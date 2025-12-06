import { z } from 'zod';

const createAuth = z.object({
  body: z.object({
    name: z.string({ required_error: 'Auth name is required' }),
  }),
});

// Add other schemas here as needed
// export const updateAuth = z.object({...});

export const authSchema = {
  createAuth,
  // updateAuth,
};

// Type export for mongoose schema
export type IAuth = z.infer<typeof createAuth>['body'];
