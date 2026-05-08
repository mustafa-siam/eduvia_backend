import catchAsync from '@/utils/catchAsync';
import { sendSuccessResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';
import { teamService } from './team.service';
import { cloudinaryConfig } from '@/utils/uploadFile';

export const createTeam = catchAsync(async (req, res) => {
  const payload = { ...req.body };

  // 1. Handle stringified socials from FormData
  if (typeof payload.socials === 'string') {
    payload.socials = JSON.parse(payload.socials);
  }

  // 2. Handle Image Upload
  if (req.file) {
    const uploadResult = await cloudinaryConfig.uploadFileToCloudinary(
      req.file.buffer,
      req.file.originalname,
      { folder: 'team' }
    );
    payload.image = uploadResult.secure_url;
  }

  const data = await teamService.createTeam(payload);

  sendSuccessResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Team member created successfully',
    data,
  });
});

export const getAllTeams = catchAsync(async (_req, res) => {
  const data = await teamService.getAllTeams();

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Team fetched successfully',
    data,
  });
});

export const getTeamById = catchAsync(async (req, res) => {
  const data = await teamService.getTeamById(req.params.id);

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Team member fetched successfully',
    data,
  });
});

export const updateTeam = catchAsync(async (req, res) => {
  const payload = { ...req.body };

  // 1. Handle stringified socials
  if (typeof payload.socials === 'string') {
    payload.socials = JSON.parse(payload.socials);
  }

  // 2. Handle Image Update if a new file is provided
  if (req.file) {
    const uploadResult = await cloudinaryConfig.uploadFileToCloudinary(
      req.file.buffer,
      req.file.originalname,
      { folder: 'team' }
    );
    payload.image = uploadResult.secure_url;
  }

  const data = await teamService.updateTeam(req.params.id, payload);

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Team member updated successfully',
    data,
  });
});

export const deleteTeam = catchAsync(async (req, res) => {
  const data = await teamService.deleteTeam(req.params.id);

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Team member deleted successfully',
    data,
  });
});

export const teamController = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
};
