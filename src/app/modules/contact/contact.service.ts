import { IContact, ContactModel } from './contact.model';

/* CREATE */
const createContact = async (payload: IContact) => {
  return await ContactModel.create(payload);
};

/* GET ALL (Pinned First) */
const getAllContacts = async () => {
  return await ContactModel.find().sort({ pinned: -1, createdAt: -1 });
};

/* UPDATE STATUS */
const updateContactStatus = async (id: string, status: 'pending' | 'contacted' | 'resolved') => {
  return await ContactModel.findByIdAndUpdate(id, { status }, { new: true });
};

/* TOGGLE PIN ⭐ */
const togglePin = async (id: string) => {
  const contact = await ContactModel.findById(id);

  if (!contact) return null;

  contact.pinned = !contact.pinned;
  await contact.save();

  return contact;
};

/* DELETE */
const deleteContact = async (id: string) => {
  return await ContactModel.findByIdAndDelete(id);
};

export const contactService = {
  createContact,
  getAllContacts,
  updateContactStatus,
  togglePin, // ⭐ added
  deleteContact,
};
