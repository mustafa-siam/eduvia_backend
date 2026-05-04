import { ITeam } from './team.schema';
import TeamModel from './team.model';

const createTeam = async (payload: ITeam) => {
  const created = await TeamModel.create(payload);
  return created;
};

export const teamService = {
  createTeam,
};
