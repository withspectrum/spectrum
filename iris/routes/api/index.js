// @flow
import { Router } from 'express';

const apiRouter = Router();

import graphiql from './graphiql';
// Only allow GraphiQL in development
if (process.env.NODE_ENV === 'development') {
  apiRouter.use('/graphiql', graphiql);
}

import slackImporter from './slackImporter';
apiRouter.use('/slack', slackImporter);

import stripe from './stripe';
apiRouter.use('/stripe', stripe);

import graphql from './graphql';
apiRouter.use('/', graphql);

export default apiRouter;
