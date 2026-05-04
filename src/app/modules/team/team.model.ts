import { Schema, model, Document } from 'mongoose';
import { ITeam } from './team.schema';

const teamSchema = new Schema<ITeam & Document>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const TeamModel = model<ITeam & Document>('Team', teamSchema);
export default TeamModel;
