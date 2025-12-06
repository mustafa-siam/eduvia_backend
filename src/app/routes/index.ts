import { Router } from 'express';
import userRouter from '../modules/user/user.route';
import authRouter from '../modules/auth/auth.route';

const router = Router();

const routes = [
  {
    path: '/users',
    router: userRouter,
  },
  {
    path: '/auth',
    router: authRouter,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.router);
});

export default router;
