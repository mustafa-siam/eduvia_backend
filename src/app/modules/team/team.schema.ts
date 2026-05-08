import { z } from 'zod';

const socialSchema = z.object({
  platform: z.string({ required_error: 'Platform is required' }),
  url: z.string({ required_error: 'URL is required' }).url(),
});

const teamBodySchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(1),
  role: z.string({ required_error: 'Role is required' }).min(1),
  // Image is validated as optional string because the controller will
  // inject the URL after uploading the file to Cloudinary/S3
  image: z.string().optional(),
  socials: z.union([z.string(), z.array(socialSchema)]).optional(),
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
