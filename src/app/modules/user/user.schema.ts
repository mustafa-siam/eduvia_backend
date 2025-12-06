import { z } from 'zod';
import { userConstant } from './user.constant';

const createUser = z.object({
  body: z.object({
    clerkId: z.string({ required_error: 'Clerk ID is required' }),
    firstName: z.string({ required_error: 'First name is required' }),
    lastName: z.string({ required_error: 'Last name is required' }),
    imageUrl: z.string().url('Invalid URL').optional(),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    lastLogin: z.string().optional(),
    role: z
      .nativeEnum(userConstant.USER_ROLES, { required_error: 'Role is required' })
      .default('user'),
  }),
});

const updateUser = createUser.shape.body.partial();

const updateUserPermissions = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    newRole: z.nativeEnum(userConstant.USER_ROLES, { required_error: 'New role is required' }),
  }),
});

const deleteUserFromClerk = z.object({
  body: z.object({
    clerkId: z.string({ required_error: 'Clerk ID is required' }),
  }),
});

export const userSchema = {
  updateUser,
  createUser,
  deleteUserFromClerk,
  updateUserPermissions,
};

export type IUser = z.infer<typeof createUser>['body'];
