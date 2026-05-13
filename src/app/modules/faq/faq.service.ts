import AppError from '@/app/errors/handlers/AppError';
import { StatusCodes } from 'http-status-codes';

import FAQModel from './faq.model';
import { IFaq } from './faq.schema';

const createFaq = async (payload: IFaq) => {
  return await FAQModel.create(payload);
};

const getAllFaqs = async () => {
  return await FAQModel.find().sort({ createdAt: -1 }).lean();
};

const getFaqById = async (id: string) => {
  const faq = await FAQModel.findById(id).lean();

  if (!faq) {
    throw new AppError('FAQ not found', StatusCodes.NOT_FOUND);
  }

  return faq;
};

const updateFaq = async (id: string, payload: Partial<IFaq>) => {
  const updated = await FAQModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updated) {
    throw new AppError('FAQ not found', StatusCodes.NOT_FOUND);
  }

  return updated;
};

const deleteFaq = async (id: string) => {
  const deleted = await FAQModel.findByIdAndDelete(id).lean();

  if (!deleted) {
    throw new AppError('FAQ not found', StatusCodes.NOT_FOUND);
  }

  return deleted;
};

export const faqService = {
  createFaq,
  getAllFaqs,
  getFaqById,
  updateFaq,
  deleteFaq,
};
