// @flow
import { Router } from 'express';
import { createSigninRoutes } from './create-signin-routes';

const googleAuthRouter = Router();
const { main, callbacks } = createSigninRoutes('google', {
  scope: 'profile email',
});

googleAuthRouter.get('/', main);

googleAuthRouter.get('/callback', ...callbacks);

export default googleAuthRouter;
