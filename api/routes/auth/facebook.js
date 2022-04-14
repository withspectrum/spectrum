// @flow
import { Router } from 'express';
import { createSigninRoutes } from './create-signin-routes';

const facebookAuthRouter = Router();
const { main, callbacks } = createSigninRoutes('facebook', {
  scope: ['email'],
});

facebookAuthRouter.get('/', main);

facebookAuthRouter.get('/callback', ...callbacks);

export default facebookAuthRouter;
