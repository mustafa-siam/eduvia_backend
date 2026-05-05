import { IContact, ContactModel } from './contact.model';

/* CREATE */
const createContact = async (payload: IContact) => {
  return await ContactModel.create(payload);
};

/* GET ALL */
const getAllContacts = async () => {
  return await ContactModel.find().sort({ createdAt: -1 });
};

/* UPDATE STATUS */
const updateContactStatus = async (id: string, status: 'pending' | 'contacted' | 'resolved') => {
  return await ContactModel.findByIdAndUpdate(id, { status }, { new: true });
};

/* DELETE */
const deleteContact = async (id: string) => {
  return await ContactModel.findByIdAndDelete(id);
};

export const contactService = {
  createContact,
  getAllContacts,
  updateContactStatus,
  deleteContact,
};
