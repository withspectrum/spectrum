// @flow
// $FlowFixMe
import { Router } from 'express';

const stripeRouter = Router();

import webhooks from '../webhooks';
stripeRouter.use('/', webhooks);

export default stripeRouter;
