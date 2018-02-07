// @flow
import { Router } from 'express';
import { createSigninRoutes } from './create-signin-routes';

const googleAuthRouter = Router();
const { main, callbacks } = createSigninRoutes('google', {
  scope: [
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read',
  ],
});

googleAuthRouter.get('/', main);

googleAuthRouter.get('/callback', ...callbacks);

export default googleAuthRouter;
