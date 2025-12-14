import catchAsync from '@/utils/catchAsync';

import { sendSuccessResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';
import UserModel from './user.model';
import AppError from '@/app/errors/handlers/AppError';
import { clerkClient, getAuth } from '@clerk/express';
import { parseFields } from '@/utils/parseFields';
import { qb } from '@/app/libs/qb';
import { userService } from './user.service';
import { exportToExcel } from '@/utils/exportToExcel';

const userUpdateHandler = catchAsync(async (req, res) => {
  const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User updated successfully',
    ddfata: updatedUser,
  });
  dfdfdf;
});

const getAllUsersHandler = catchAsync(async (req, res) => {
  let selectedFields = parseFields(
    req.query.fields as string | undefined,
    req.query.ignoreFields as string | undefined
  );

  // build filters: prefer explicit role filter, otherwise exclude ignoreRole if provided
  const filters: any = {};
  if (req.query.role) {
    filters.role = String(req.query.role);
  } else if (req.query.ignoreRole) {
    filters.role = { $ne: String(req.query.ignoreRole) };
  }

  // not return admin
  const { meta, data } = await qb(UserModel)
    .select(selectedFields)
    .search(req.query.search, ['firstName', 'lastName', 'email'])
    .filter(filters)
    .sort('-createdAt')
    .paginate({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
    })
    .exec();

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Users retrieved successfully',

    data: {
      meta,
      users: data,
    },
  });
});

const getSingleUserHandler = catchAsync(async (req, res) => {
  const { user } = await userService.getSingleUser({ _id: req.params.id });

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User retrieved successfully',
    data: user,
  });
});

const updateUserRoleHandler = catchAsync(async (req, res) => {
  const { user } = await userService.updateUserRole({ _id: req.params.id, role: req.body.role });

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User role updated successfully',
    data: user,
  });
});

const deleteUserHandler = catchAsync(async (req, res) => {
  const { user } = await userService.deleteUser({ _id: req.params.id });
  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User deleted successfully',
    data: {
      id: user._id,
      email: user.email,
    },
  });
});

const statisticsHandler = catchAsync(async (_req, res) => {
  const { totalUsers, adminUsers, regularUsers, newUsersThisWeek } = await userService.statistics();

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User statistics retrieved successfully',
    data: {
      totalUsers,
      adminUsers,
      regularUsers,
      newUsersThisWeek,
    },
  });
});

const getUserRole = catchAsync(async (req, res) => {
  const { userId } = getAuth(req);

  if (!userId) {
    throw new AppError('Unauthorized - No valid session', StatusCodes.UNAUTHORIZED);
  }

  const { user } = await userService.getUserRole({ userId: userId });

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User role retrieved successfully',
    data: {
      role: user.role,
      userId: user._id,
      email: user.email,
    },
  });
});

const handleDeleteUserFromClerk = catchAsync(async (req, res) => {
  const { clerkId } = req.body; // এটা clerkId হতে হবে

  if (!clerkId) {
    throw new AppError('Clerk ID is required', StatusCodes.BAD_REQUEST);
  }

  await clerkClient.users.deleteUser(clerkId);
  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User deleted from Clerk successfully',
  });
});

const userPermissionHandler = catchAsync(async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    throw new AppError('Unauthorized - No valid session', StatusCodes.UNAUTHORIZED);
  }

  const { newRole, email } = req.body;
  const { user } = await userService.updateUserPermission({ newRole, email, userId });

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User permissions retrieved successfully',
    data: {
      role: user.role,
      _id: user._id,
      email: user.email,
    },
  });
});

// Add this to user.controller.ts

const exportUsersHandler = catchAsync(async (req, res) => {
  console.log('✅ Export request received');
  console.log('Query params:', req.query);

  const { startDate, endDate, role, limit, exportAll, search, ignoreRole } = req.query;

  // Build filters
  const filters: Record<string, any> = {};

  // Ignore specific role (e.g., regular "user" role)
  if (ignoreRole) {
    filters.role = { $ne: String(ignoreRole) };
  }

  // Date range filter
  if (startDate && endDate) {
    filters.createdAt = {
      $gte: new Date(String(startDate)),
      $lte: new Date(String(endDate)),
    };
  }

  // Role filter (only if ignoreRole is not set, or combine them)
  if (role) {
    if (ignoreRole) {
      // If both role and ignoreRole are set, add role to the filter
      filters.role = { $eq: String(role), $ne: String(ignoreRole) };
    } else {
      filters.role = String(role);
    }
  }

  // Search filter (name or email)
  if (search) {
    const searchRegex = new RegExp(String(search).trim(), 'i');
    filters.$or = [{ firstName: searchRegex }, { lastName: searchRegex }, { email: searchRegex }];
  }

  console.log('Applied filters:', JSON.stringify(filters, null, 2));

  // Apply limit with safety cap
  let safeLimit = 0;

  if (exportAll === 'true') {
    // Export all users without limit
    safeLimit = 0;
    console.log('📊 Exporting ALL users');
  } else if (limit) {
    const queryLimit = Number(limit);
    safeLimit = queryLimit > 0 ? Math.min(queryLimit, 50000) : 1000;
    console.log(`📊 Exporting ${safeLimit} users`);
  } else {
    // Default limit if not specified
    safeLimit = 1000;
    console.log('📊 Using default limit: 1000 users');
  }

  // Fetch users with optimized query
  const query = UserModel.find(filters)
    .select('firstName lastName email role createdAt isActive updatedAt')
    .sort({ createdAt: -1 }) // Sort by newest first
    .lean();

  // Apply limit only if safeLimit > 0
  if (safeLimit > 0) {
    query.limit(safeLimit);
  }

  const users = await query.exec();

  console.log(`✅ Found ${users.length} users to export`);

  if (users.length === 0) {
    res.status(404).json({
      success: false,
      message: 'No users found with the given filters',
    });
    return;
  }

  // Prepare filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `users_export_${timestamp}`;

  console.log(`📥 Starting Excel export: ${filename}.xlsx`);

  // Export to Excel
  await exportToExcel({
    res,
    filename,
    data: users,
    sheetName: 'Users',
    columns: [
      {
        header: 'First Name',
        key: 'firstName',
        width: 20,
      },
      {
        header: 'Last Name',
        key: 'lastName',
        width: 20,
      },
      {
        header: 'Email',
        key: 'email',
        width: 35,
      },
      {
        header: 'Role',
        key: 'role',
        width: 15,
        transform: (v: string) => {
          if (!v) return 'N/A';
          // Convert role to readable format
          return v
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        },
      },

      {
        header: 'Joined Date',
        key: 'createdAt',
        width: 25,
        transform: (v: Date) => {
          if (!v) return 'N/A';
          return new Date(v).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        },
      },
      {
        header: 'Last Updated',
        key: 'updatedAt',
        width: 25,
        transform: (v: Date) => {
          if (!v) return 'N/A';
          return new Date(v).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        },
      },
    ],
  });

  console.log('✅ Export completed successfully');
  return;
});

const getLoggedInUser = catchAsync(async (req, res) => {
  const { userId } = getAuth(req);

  console.log(userId);

  if (!userId) {
    throw new AppError('Unauthorized - No valid session', StatusCodes.UNAUTHORIZED);
  }

  // Find user in database
  const user = await UserModel.findOne({ clerkId: userId }).select('-__v');

  if (!user) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User retrieved successfully',
    data: user,
  });
});

export const userController = {
  userUpdateHandler,
  getAllUsersHandler,
  getSingleUserHandler,
  deleteUserHandler,
  updateUserRoleHandler,
  statisticsHandler,
  handleDeleteUserFromClerk,
  getUserRole,
  userPermissionHandler,
  exportUsersHandler,
  getLoggedInUser,
};
