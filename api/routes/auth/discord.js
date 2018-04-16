// @flow
import { Router } from 'express';
import { createSigninRoutes } from './create-signin-routes';

const discordAuthRouter = Router();
const { main, callbacks } = createSigninRoutes('discord', {
  scope: ['identify', 'email'],
});

discordAuthRouter.get('/', main);

discordAuthRouter.get('/callback', ...callbacks);

export default discordAuthRouter;
