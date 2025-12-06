import { IAuth } from './auth.schema';
import AuthModel from './auth.model';

const createAuth = async (payload: IAuth) => {
  const created = await AuthModel.create(payload);
  return created;
};

export const authService = {
  createAuth,
};
