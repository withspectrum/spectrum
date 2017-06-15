// @flow
/**
 * The entry point for the server, this is where everything starts
 */
const IS_PROD = process.env.NODE_ENV === 'production';
const PORT = 3001;
const ONE_YEAR = 31556952000;
const ONE_DAY = 86400000;

const path = require('path');
const fs = require('fs');
const { createServer } = require('http');
const Raven = require('raven');
//$FlowFixMe
const express = require('express');
//$FlowFixMe
const passport = require('passport');
//$FlowFixMe
const session = require('express-session');
//$FlowFixMe
const SessionStore = require('session-rethinkdb')(session);
//$FlowFixMe
const bodyParser = require('body-parser');
//$FlowFixMe
const cookieParser = require('cookie-parser');
//$FlowFixMe
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const { execute, subscribe } = require('graphql');
//$FlowFixMe
const { SubscriptionServer } = require('subscriptions-transport-ws');
//$FlowFixMe
const { apolloUploadExpress } = require('apollo-upload-server');
//$FlowFixMe
const cors = require('cors');
//$FlowFixMe
const OpticsAgent = require('optics-agent');

const listeners = require('./subscriptions/listeners');

const schema = require('./schema');
OpticsAgent.instrumentSchema(schema);
const { init: initPassport } = require('./authentication.js');
import createLoaders from './loaders';
import getMeta from './utils/get-page-meta';
import { IsUserError } from './utils/UserError';
import sessionStore, { SESSION_COOKIE_SECRET } from './utils/session-store';

console.log('Server starting...');

// Initialize authentication
initPassport();
// API server
const app = express();

import middlewares from './routes/middlewares';
app.use(middlewares);

import authRoutes from './routes/auth';
app.use('/auth', authRoutes);

import apiRoutes from './routes/api';
app.use('/api', apiRoutes);

// In production use express to serve the React app
// In development this is done by react-scripts, which starts its own server
if (IS_PROD) {
  const { graphql } = require('graphql');
  // Load index.html into memory
  var index = fs
    .readFileSync(path.resolve(__dirname, '..', 'build', 'index.html'))
    .toString();
  app.use(
    express.static(path.resolve(__dirname, '..', 'build'), { index: false })
  );
  app.get('*', function(req, res) {
    getMeta(req.url, (query: string): Promise =>
      graphql(schema, query, undefined, {
        loaders: createLoaders(),
        user: req.user,
      })
    ).then(({ title, description, extra }) => {
      // In production inject the meta title and description
      res.send(
        index
          .replace(/%OG_TITLE%/g, title)
          .replace(/%OG_DESCRIPTION%/g, description)
          .replace(/<meta name="%OG_EXTRA%">/g, extra || '')
      );
    });
  });
}

import type { Loader } from './loaders/types';
export type GraphQLContext = {
  user: Object,
  loaders: {
    [key: string]: Loader,
  },
};

const server = createServer(app);
const sessionCookieParser = cookieParser(SESSION_COOKIE_SECRET);
const { getUser } = require('./models/user');
// Start subscriptions server
const subscriptionsServer = SubscriptionServer.create(
  {
    execute,
    subscribe,
    schema,
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
            if (err || !session || !session.passport || !session.passport.user)
              return res({
                // TODO: Pass optics to subscriptions context
                // opticsContext: OpticsAgent.context(req),
                loaders: createLoaders(),
              });
            getUser({ id: session.passport.user })
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
    path: '/websocket',
  }
);

// Start webserver
server.listen(PORT);

// Start database listeners
listeners.start();
console.log('GraphQL server running!');
