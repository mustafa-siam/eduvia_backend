import { Router } from 'express';
import { teamController } from './team.controller';
import validateRequest from '@/app/middlewares/validateRequest';
import { teamSchema } from './team.schema';
import { defineRoutes } from '@/utils/defineRoutes';

const teamRouter = Router();

defineRoutes(teamRouter, [
  {
    method: 'post',
    path: '/create',
    middlewares: [validateRequest(teamSchema.createTeam)],
    handler: teamController.teamHandler,
  },
  // add other routes as needed
]);

export default teamRouter;
