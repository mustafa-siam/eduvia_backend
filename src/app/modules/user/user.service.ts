import { IUser } from './user.schema';
import UserModel from './user.model';
import { Types } from 'mongoose';
import AppError from '@/app/errors/handlers/AppError';
import { StatusCodes } from 'http-status-codes';
import { userConstant } from './user.constant';

const createUser = async (payload: IUser) => {
  const created = await UserModel.create(payload);
  return created;
};

const getSingleUser = async ({ _id }: { _id: Types.ObjectId | string }) => {
  const user = await UserModel.findById(_id).select('-__v');
  if (!user) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }
  return { user };
};

const updateUserRole = async ({ _id, role }: { _id: Types.ObjectId | string; role: string }) => {
  if (!(Object.values(userConstant.USER_ROLES) as string[]).includes(role)) {
    throw new AppError('Invalid role specified', StatusCodes.BAD_REQUEST);
  }

  const user = await UserModel.findByIdAndUpdate(_id, { role }, { new: true });
  if (!user) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }
  return { user };
};

const deleteUser = async ({ _id }: { _id: Types.ObjectId | string }) => {
  const user = await UserModel.findByIdAndDelete(_id);
  if (!user) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }
  return { user };
};

const getUserRole = async ({ userId }: { userId: Types.ObjectId | string }) => {
  const user = await UserModel.findOne({ clerkId: userId });

  if (!user) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  return { user };
};

const statistics = async () => {
  const totalUsers = await UserModel.countDocuments();
  const adminUsers = await UserModel.countDocuments({ role: 'admin' });
  const regularUsers = await UserModel.countDocuments({ role: 'user' });

  // Users created in last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const newUsersThisWeek = await UserModel.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });

  return {
    totalUsers,
    newUsersThisWeek,
    adminUsers,
    regularUsers,
  };
};

const updateUserPermission = async ({
  email,
  newRole,
  userId,
}: {
  email: string;
  newRole: IUser['role'];
  userId: Types.ObjectId | string;
}) => {
  const user = await UserModel.findOne({ email });
  const loggedInUser = await UserModel.findOne({ clerkId: userId });
  if (!loggedInUser) {
    throw new AppError('UnAuthorize', StatusCodes.UNAUTHORIZED);
  }
  if (!user) {
    throw new AppError('User not registered', StatusCodes.NOT_FOUND);
  }

  if (email === loggedInUser.email) {
    throw new AppError('You cannot update your own role.', StatusCodes.BAD_REQUEST);
  }

  // check if exist new role userConstant
  if (!(Object.values(userConstant.USER_ROLES) as IUser['role'][]).includes(newRole)) {
    throw new AppError('Invalid role specified', StatusCodes.BAD_REQUEST);
  }

  if (user.role === newRole) {
    throw new AppError('User already has the specified role', StatusCodes.BAD_REQUEST);
  }

  user.role = newRole;
  await user.save();

  return { user };
};

export const userService = {
  createUser,
  getSingleUser,
  updateUserRole,
  getUserRole,
  deleteUser,
  statistics,
  updateUserPermission,
};
