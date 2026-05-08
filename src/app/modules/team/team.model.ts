import { Schema, model, Document } from 'mongoose';
import { ITeam } from './team.schema';

const socialSchema = new Schema(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const teamSchema = new Schema<ITeam & Document>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    socials: { type: [socialSchema], default: [] },
  },
  { timestamps: true }
);

const TeamModel = model<ITeam & Document>('Team', teamSchema);
export default TeamModel;
