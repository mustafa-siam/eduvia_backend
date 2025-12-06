import { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';

import { StatusCodes } from 'http-status-codes';
import UserModel from '../user/user.model';
import AppError from '@/app/errors/handlers/AppError';
import { userConstant } from '../user/user.constant';

const requireAuth = () => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const { userId } = getAuth(req);

      if (!userId) {
        return next(
          new AppError('Unauthorized - Please log in to continue.', StatusCodes.UNAUTHORIZED)
        );
      }

      next();
    } catch (error) {
      console.error('[requireAuth] Error:', error);
      return next(
        new AppError('Authentication failed - Invalid token or session.', StatusCodes.UNAUTHORIZED)
      );
    }
  };
};

/**
 * Optional: Custom middleware to verify user exists in database
 */
const verifyUserExists = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      throw new AppError('Unauthorized - No valid session', StatusCodes.UNAUTHORIZED);
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check user role
 */
const requireRole = (allowedRoles: string[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const { userId } = getAuth(req);

      if (!userId) {
        throw new AppError('Unauthorized - Please log in to continue.', StatusCodes.UNAUTHORIZED);
      }

      const user = await UserModel.findOne({ clerkId: userId }).select('role');

      if (!user) {
        throw new AppError('User not found', StatusCodes.NOT_FOUND);
      }

      if (!allowedRoles.includes(user.role)) {
        throw new AppError(
          `Access denied. Required roles: ${allowedRoles.join(', ')}`,
          StatusCodes.FORBIDDEN
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const authMiddleware = {
  requireAuth,
  verifyUserExists,
  requireRole,
  requireAdmin: requireRole([userConstant.USER_ROLES.ADMIN]),
  requireModerator: requireRole([userConstant.USER_ROLES.MODERATOR]),
  requireAdminAndModerator: requireRole([
    userConstant.USER_ROLES.ADMIN,
    userConstant.USER_ROLES.MODERATOR,
  ]),

  requireUser: requireRole([userConstant.USER_ROLES.USER, userConstant.USER_ROLES.ADMIN]),
};
