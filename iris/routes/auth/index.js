// @flow
import { Router } from 'express';
import twitterAuthRoutes from './twitter';
import logoutRoutes from './logout';

const authRouter = Router();

authRouter.use('/twitter', twitterAuthRoutes);
authRouter.use('/logout', logoutRoutes);

export default authRouter;
