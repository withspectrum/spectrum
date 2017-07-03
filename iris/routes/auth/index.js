// @flow
import { Router } from 'express';
import twitterAuthRoutes from './twitter';
import facebookAuthRoutes from './facebook';
import logoutRoutes from './logout';

const authRouter = Router();

authRouter.use('/twitter', twitterAuthRoutes);
authRouter.use('/facebook', facebookAuthRoutes);
authRouter.use('/logout', logoutRoutes);

export default authRouter;
