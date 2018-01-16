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
      onOperation: (_: any, params: Object, rawSocket: Socket) => {
        const errorFormatter = createErrorFormatter(rawSocket.upgradeReq);
        params.formatError = errorFormatter;
        return params;
      },
      onDisconnect: rawSocket => {
        getUserIdFromReq(rawSocket.upgradeReq)
          .then(id => {
            setUserOnline(id, false);
          })
          .catch(err => {
            // Ignore errors
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
