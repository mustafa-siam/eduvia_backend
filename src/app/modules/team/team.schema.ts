import { z } from 'zod';

const createTeam = z.object({
  body: z.object({
    name: z.string({ required_error: 'Team name is required' }),
  }),
});

// Add other schemas here as needed
// export const updateTeam = z.object({...});

export const teamSchema = {
  createTeam,
  // updateTeam,
};

// Type export for mongoose schema
export type ITeam = z.infer<typeof createTeam>['body'];
