// @flow
// $FlowFixMe
import { Router } from 'express';

const stripeRouters = Router();

import webhooks from './webhooks';
stripeRouters.use('/', webhooks);

export default stripeRouters;
