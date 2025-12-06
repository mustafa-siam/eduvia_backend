const USER_MESSAGES = {
  SUCCESS: 'User operation successful',
  FAILED: 'User operation failed',
};

const USER_ROLES = {
  STUDENT: 'student',
  USER: 'user',
  MODERATOR: 'moderator',
  TEACHER: 'teacher',
  STAFF: 'staff',
  ADMIN: 'admin',
} as const;

const USER_LOGIN = {
  MAX_ATTEMPTS: 5,
  LOCK_TIME: 30 * 60 * 1000,
  ATTEMPT_WINDOW: 15 * 60 * 1000,
};

export const userConstant = {
  USER_MESSAGES,
  USER_ROLES,
  USER_LOGIN,
};

export type userRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
