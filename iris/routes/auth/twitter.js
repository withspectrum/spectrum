// @flow
import { Router } from 'express';
import { createSigninRoutes } from './create-signin-routes';

const twitterAuthRouter = Router();
const { main, callbacks } = createSigninRoutes('twitter');

twitterAuthRouter.get('/', main);

twitterAuthRouter.get('/callback', ...callbacks);

export default twitterAuthRouter;
