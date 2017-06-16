// @flow
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';

import schema from '../schema';
import createLoaders from '../loaders';
import { getUser, setUserOnline } from '../models/user';
import sessionStore, { sessionCookieParser } from '../utils/session-store';

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
        sessionCookieParser(rawSocket.upgradeReq, null, err => {
          if (err) return;

          const sessionId = rawSocket.upgradeReq.signedCookies['connect.sid'];
          sessionStore.get(sessionId, (err, session) => {
            if (err || !session || !session.passport || !session.passport.user)
              return;

            // Set the user to offline
            setUserOnline(session.passport.user, false);
          });
        });
      },
      onConnect: (connectionParams, rawSocket) =>
        new Promise((res, rej) => {
          // Authenticate the connecting user
          sessionCookieParser(rawSocket.upgradeReq, null, err => {
            if (err)
              return res({
                // TODO: Pass optics to subscriptions context
                // opticsContext: OpticsAgent.context(req),
                loaders: createLoaders(),
              });
            const sessionId = rawSocket.upgradeReq.signedCookies['connect.sid'];
            sessionStore.get(sessionId, (err, session) => {
              if (
                err || !session || !session.passport || !session.passport.user
              )
                return res({
                  // TODO: Pass optics to subscriptions context
                  // opticsContext: OpticsAgent.context(req),
                  loaders: createLoaders(),
                });
              // Set the user to "online"
              setUserOnline(session.passport.user, true)
                .then(user => {
                  return res({
                    user,
                    // TODO: Pass optics to subscriptions context
                    // opticsContext: OpticsAgent.context(req),
                    loaders: createLoaders(),
                  });
                })
                .catch(err => {
                  return res({
                    // TODO: Pass optics to subscriptions context
                    // opticsContext: OpticsAgent.context(req),
                    loaders: createLoaders(),
                  });
                });
            });
          });
        }),
    },
    {
      server,
      path,
    }
  );
};

export default createSubscriptionsServer;
