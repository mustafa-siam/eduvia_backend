import AppError from '@/app/errors/handlers/AppError';
import { StatusCodes } from 'http-status-codes';
import TeamModel from './team.model';
import { ITeam } from './team.schema';

const createTeam = async (payload: ITeam) => {
  return await TeamModel.create(payload);
};

const getAllTeams = async () => {
  return await TeamModel.find().sort({ createdAt: -1 }).lean();
};

const getTeamById = async (id: string) => {
  const team = await TeamModel.findById(id).lean();

  if (!team) {
    throw new AppError('Team member not found', StatusCodes.NOT_FOUND);
  }

  return team;
};

const updateTeam = async (id: string, payload: Partial<ITeam>) => {
  const updated = await TeamModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updated) {
    throw new AppError('Team member not found', StatusCodes.NOT_FOUND);
  }

  return updated;
};

const deleteTeam = async (id: string) => {
  const deleted = await TeamModel.findByIdAndDelete(id).lean();

  if (!deleted) {
    throw new AppError('Team member not found', StatusCodes.NOT_FOUND);
  }

  return deleted;
};

export const teamService = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
};
