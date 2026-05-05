import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ContactControllers } from './contact.controller';
import { contactValidation } from './contact.schema';

const router = express.Router();

/* PUBLIC */
router.post(
  '/',
  validateRequest(contactValidation.createContact),
  ContactControllers.createContact
);

/* DASHBOARD */
router.get('/', ContactControllers.getAllContacts);

router.patch(
  '/:id',
  validateRequest(contactValidation.updateStatus),
  ContactControllers.updateContactStatus
);

router.delete('/:id', ContactControllers.deleteContact);

export const ContactRoutes = router;
