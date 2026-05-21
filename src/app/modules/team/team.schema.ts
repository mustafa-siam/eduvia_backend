import { z } from 'zod';

const localizedStringSchema = z.object({
  en: z.string({ required_error: 'English content is required' }).min(1),
  bn: z.string({ required_error: 'Bangla content is required' }).min(1),
});

const socialSchema = z.object({
  platform: z.string({ required_error: 'Platform is required' }),
  url: z.string({ required_error: 'URL is required' }).url(),
});

const educationSchema = z.object({
  title: localizedStringSchema,
});

const experienceSchema = z.object({
  title: localizedStringSchema,
});

// Structural preprocessor helper to cleanly parse incoming Multi-part FormData strings
const preprocessJson = (schema: z.ZodTypeAny) =>
  z.preprocess((val) => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val);
      } catch {
        return val;
      }
    }
    return val;
  }, schema);

const teamBodySchema = z.object({
  name: preprocessJson(localizedStringSchema),
  role: preprocessJson(localizedStringSchema),
  details: preprocessJson(localizedStringSchema).optional(),
  image: z.string().optional(),
  socials: preprocessJson(z.array(socialSchema)).optional().default([]),
  education: preprocessJson(z.array(educationSchema)).optional().default([]),
  experience: preprocessJson(z.array(experienceSchema)).optional().default([]),
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
