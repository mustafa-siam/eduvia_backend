import { z } from 'zod';

const socialSchema = z.object({
  platform: z.string({ required_error: 'Platform is required' }),
  url: z.string({ required_error: 'URL is required' }).url(),
});

const educationSchema = z.object({
  title: z.string({ required_error: 'Education is required' }).min(1),
});

const experienceSchema = z.object({
  title: z.string({ required_error: 'Experience is required' }).min(1),
});

const teamBodySchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(1),

  role: z.string({ required_error: 'Role is required' }).min(1),

  image: z.string().optional(),

  socials: z.union([z.string(), z.array(socialSchema)]).optional(),

  education: z.union([z.string(), z.array(educationSchema)]).optional(),

  experience: z.union([z.string(), z.array(experienceSchema)]).optional(),

  // ✅ FIXED: now string only
  details: z.string().optional(),
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
