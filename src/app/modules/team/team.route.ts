import { Router } from 'express';
import { teamController } from './team.controller';
import validateRequest from '@/app/middlewares/validateRequest';
import { teamSchema } from './team.schema';
import { defineRoutes } from '@/utils/defineRoutes';
import { authMiddleware } from '../auth/auth.middleware';
import { commonSchema } from '@/app/schema/common.schema';

const teamRouter = Router();

defineRoutes(teamRouter, [
  {
    method: 'get',
    path: '/',
    handler: teamController.getAllTeams,
  },
  {
    method: 'get',
    path: '/:id',
    middlewares: [validateRequest(commonSchema.idSchema)],
    handler: teamController.getTeamById,
  },
  {
    method: 'post',
    path: '/create',
    // middlewares: [
    //   authMiddleware.requireAuth(),
    //   authMiddleware.requireAdmin,
    //   validateRequest(teamSchema.createTeam),
    // ],
    handler: teamController.createTeam,
  },
  {
    method: 'patch',
    path: '/:id',
    middlewares: [
      validateRequest(commonSchema.idSchema),
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
      validateRequest(teamSchema.updateTeam),
    ],
    handler: teamController.updateTeam,
  },
  {
    method: 'delete',
    path: '/:id',
    middlewares: [
      validateRequest(commonSchema.idSchema),
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
    ],
    handler: teamController.deleteTeam,
  },
]);

export default teamRouter;
