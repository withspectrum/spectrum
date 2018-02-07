// @flow
import { Router } from 'express';
import { createSigninRoutes } from './create-signin-routes';

const githubAuthRouter = Router();
const { main, callbacks } = createSigninRoutes('github', {
  scope: ['user'],
});

githubAuthRouter.get('/', main);

githubAuthRouter.get('/callback', ...callbacks);

export default githubAuthRouter;
