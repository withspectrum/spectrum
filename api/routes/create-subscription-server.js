// @flow
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';

import schema from '../schema';
import createLoaders from '../loaders';
import { getUser, setUserOnline } from '../models/user';
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
      onOperation: (_: any, params: Object) => {
        const errorFormatter = createErrorFormatter();
        params.formatError = errorFormatter;
        return params;
      },
      onDisconnect: rawSocket => {
        return getUserIdFromReq(rawSocket.upgradeReq)
          .then(id => {
            return setUserOnline(id, false);
          })
          .catch(err => {
            console.error(err);
          });
      },
      onConnect: (connectionParams, rawSocket) =>
        getUserIdFromReq(rawSocket.upgradeReq)
          .then(id => setUserOnline(id, true))
          .then(user => {
            return {
              user,
              loaders: createLoaders({ cache: false }),
            };
          })
          .catch(err => {
            console.error(err);
            return {
              loaders: createLoaders({ cache: false }),
            };
          }),
    },
    {
      server,
      path,
    }
  );
};

export default createSubscriptionsServer;
