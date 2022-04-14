// @flow
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';

import schema from '../schema';
import createLoaders from '../loaders';
import { setUserOnline } from 'shared/db/queries/user';
import { getUserIdFromReq } from '../utils/session-store';
import createErrorFormatter from '../utils/create-graphql-error-formatter';

/**
 * Create a subscription server based on an exisiting express.js server
 */
const createSubscriptionsServer = (server: any, path: string) => {
  // Start subscriptions server
  return SubscriptionServer.create(
    {
      execute,
      subscribe,
      schema,
      keepAlive: 10000,
    },
    {
      server,
      path,
    }
  );
};

export default createSubscriptionsServer;
