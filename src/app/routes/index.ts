import { Router } from 'express';
import userRouter from '../modules/user/user.route';
import authRouter from '../modules/auth/auth.route';
import blogRouter from '../modules/blog/blog.route';
import teamRouter from '../modules/team/team.route';
import serviceRouter from '../modules/services/services.route';
import testimonialRouter from '../modules/testimonials/testimonials.route';
import { ContactRoutes } from '../modules/contact/contact.route';
import faqRouter from '../modules/faq/faq.route';

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
  {
    path: '/blogs',
    router: blogRouter,
  },
  {
    path: '/teams',
    router: teamRouter,
  },
  {
    path: '/services',
    router: serviceRouter,
  },
  {
    path: '/testimonials',
    router: testimonialRouter,
  },
  {
    path: '/contacts',
    router: ContactRoutes,
  },
  {
    path: '/faqs',
    router: faqRouter,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.router);
});

export default router;
