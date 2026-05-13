import catchAsync from '@/utils/catchAsync';
import { sendSuccessResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';

import { faqService } from './faq.service';

export const createFaq = catchAsync(async (req, res) => {
  const data = await faqService.createFaq(req.body);

  sendSuccessResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'FAQ created successfully',
    data,
  });
});

export const getAllFaqs = catchAsync(async (_req, res) => {
  const data = await faqService.getAllFaqs();

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'FAQs fetched successfully',
    data,
  });
});

export const getFaqById = catchAsync(async (req, res) => {
  const data = await faqService.getFaqById(req.params.id);

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'FAQ fetched successfully',
    data,
  });
});

export const updateFaq = catchAsync(async (req, res) => {
  const data = await faqService.updateFaq(req.params.id, req.body);

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'FAQ updated successfully',
    data,
  });
});

export const deleteFaq = catchAsync(async (req, res) => {
  const data = await faqService.deleteFaq(req.params.id);

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'FAQ deleted successfully',
    data,
  });
});

export const faqController = {
  createFaq,
  getAllFaqs,
  getFaqById,
  updateFaq,
  deleteFaq,
};
