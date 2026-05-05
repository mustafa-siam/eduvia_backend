import { z } from 'zod';

const socialSchema = z.object({
  platform: z.string({ required_error: 'Platform is required' }),
  url: z.string({ required_error: 'URL is required' }).url(),
});

const teamBodySchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(1),
  role: z.string({ required_error: 'Role is required' }).min(1),
  image: z.string({ required_error: 'Image is required' }).min(1),
  socials: z.array(socialSchema).optional(),
});

const createTeam = z.object({
  body: teamBodySchema,
});

const updateTeam = z.object({
  body: teamBodySchema.partial(),
});

export const teamSchema = {
  createTeam,
  updateTeam,
};

export type ITeam = z.infer<typeof teamBodySchema>;
