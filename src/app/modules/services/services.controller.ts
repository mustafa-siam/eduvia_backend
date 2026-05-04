import catchAsync from '@/utils/catchAsync';
import { servicesService } from './services.service';
import { sendSuccessResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';

export const servicesHandler = catchAsync(async (req, res) => {
  const data = await servicesService.createServices(req.body);
  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Services request processed',
    data,
  });
});

export const servicesController = {
  servicesHandler,
};
