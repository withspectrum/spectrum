import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';

import schema from '../schema';
import createLoaders from '../loaders';
import { getUser, setUserOnline } from '../models/user';
import sessionStore, {
  sessionCookieParser,
  getUserIdFromReq,
} from '../utils/session-store';

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
              // TODO: Pass optics to subscriptions context
              // opticsContext: OpticsAgent.context(req),
              loaders: createLoaders(),
            };
          })
          .catch(err => {
            return {
              // TODO: Pass optics to subscriptions context
              // opticsContext: OpticsAgent.context(req),
              loaders: createLoaders(),
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
