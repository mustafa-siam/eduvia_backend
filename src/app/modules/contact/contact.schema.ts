import { z } from 'zod';

const contactBodySchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone/WhatsApp is required'),
  destination: z.string().min(1, 'Please select a destination'),
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'contacted', 'resolved']),
  }),
});

/* OPTIONAL (not used now, but future-safe) */
const togglePinSchema = z.object({});

export const contactValidation = {
  createContact: z.object({
    body: contactBodySchema,
  }),
  updateStatus: updateStatusSchema,
  togglePin: togglePinSchema,
};
