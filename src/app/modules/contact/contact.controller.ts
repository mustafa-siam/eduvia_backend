import { Request, Response } from 'express';
import catchAsync from '@/utils/catchAsync';
import { sendSuccessResponse } from '@/utils/response';
import { contactService } from './contact.service';

/* CREATE */
const createContact = catchAsync(async (req: Request, res: Response) => {
  const result = await contactService.createContact(req.body);

  sendSuccessResponse(res, {
    statusCode: 201,
    message: 'Contact request submitted successfully',
    data: result,
  });
});

/* GET ALL */
const getAllContacts = catchAsync(async (_req: Request, res: Response) => {
  const result = await contactService.getAllContacts();

  sendSuccessResponse(res, {
    statusCode: 200,
    message: 'Contacts retrieved successfully',
    data: result,
  });
});

/* UPDATE STATUS */
const updateContactStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await contactService.updateContactStatus(id, status);

  sendSuccessResponse(res, {
    statusCode: 200,
    message: 'Contact status updated',
    data: result,
  });
});

/* DELETE */
const deleteContact = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  await contactService.deleteContact(id);

  sendSuccessResponse(res, {
    statusCode: 200,
    message: 'Contact deleted successfully',
    data: null,
  });
});

export const ContactControllers = {
  createContact,
  getAllContacts,
  updateContactStatus,
  deleteContact,
};
