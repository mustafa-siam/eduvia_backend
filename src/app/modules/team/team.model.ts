import { Schema, model, Document } from 'mongoose';
import { ITeam } from './team.schema';

const localizedSchema = new Schema(
  {
    en: { type: String, required: true, trim: true },
    bn: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const socialSchema = new Schema(
  {
    platform: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const educationSchema = new Schema(
  {
    title: { type: localizedSchema, required: true },
  },
  { _id: false }
);

const experienceSchema = new Schema(
  {
    title: { type: localizedSchema, required: true },
  },
  { _id: false }
);

const teamSchema = new Schema<ITeam & Document>(
  {
    name: { type: localizedSchema, required: true },
    role: { type: localizedSchema, required: true },
    image: { type: String, required: true, trim: true },
    details: {
      type: localizedSchema,
      required: false,
    },
    socials: {
      type: [socialSchema],
      default: [],
    },
    education: {
      type: [educationSchema],
      default: [],
    },
    experience: {
      type: [experienceSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const TeamModel = model<ITeam & Document>('Team', teamSchema);

export default TeamModel;
