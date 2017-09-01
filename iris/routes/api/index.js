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

import weeklyDigest from './weeklyDigest';
apiRouter.use('/weekly-digest', weeklyDigest);

import graphql from './graphql';
apiRouter.use('/', graphql);

export default apiRouter;
