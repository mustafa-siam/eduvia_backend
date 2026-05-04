import catchAsync from '@/utils/catchAsync';
import { teamService } from './team.service';
import { sendSuccessResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';

export const teamHandler = catchAsync(async (req, res) => {
  const data = await teamService.createTeam(req.body);
  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Team request processed',
    data,
  });
});

export const teamController = {
  teamHandler,
};
