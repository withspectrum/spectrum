// @flow
/**
 * The entry point for the server, this is where everything starts
 */
const IS_PROD = process.env.NODE_ENV === 'production';
const PORT = 3001;
// NOTE(@mxstbr): 1Password generated this, LGTM!
const COOKIE_SECRET =
  't3BUqGYFHLNjb7V8xjY6QLECgWy7ByWTYjKkPtuP%R.uLfjNBQKr9pHuKuQJXNqo';

const path = require('path');
const fs = require('fs');
const url = require('url');
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

const { db } = require('./models/db');
import { destroySession } from './models/session';
const listeners = require('./subscriptions/listeners');

const schema = require('./schema');
const { init: initPassport } = require('./authentication.js');
import createLoaders from './loaders';
import getMeta from './utils/get-page-meta';
import { IsUserError } from './utils/UserError';

Raven.config(
  'https://3bd8523edd5d43d7998f9b85562d6924:d391ea04b0dc45b28610e7fad735b0d0@sentry.io/154812',
  {
    environment: process.env.NODE_ENV,
  }
).install();
OpticsAgent.instrumentSchema(schema);

console.log('Server starting...');

// Initialize authentication
initPassport();
// API server
const app = express();
app.use(Raven.requestHandler());

const sessionStore = new SessionStore(db, {
  db: 'spectrum',
  table: 'sessions',
});

app.use(OpticsAgent.middleware());

app.use(
  cors({
    origin: IS_PROD
      ? [
          'https://spectrum.chat',
          /spectrum-(\w|-)+\.now\.sh/,
          /(\w|-)+\.spectrum.chat/,
        ]
      : 'http://localhost:3000',
    credentials: true,
  })
);
if (!IS_PROD) {
  app.use(
    '/graphiql',
    graphiqlExpress({
      endpointURL: '/api',
      subscriptionsEndpoint: `ws://localhost:3001/websocket`,
      query: `{\n  user(id: "58a023a4-912d-48fe-a61c-eec7274f7699") {\n    name\n    username\n    communities {\n      name\n      frequencies {\n        name\n        stories {\n          content {\n            title\n          }\n          messages {\n            message {\n              content\n            }\n          }\n        }\n      }\n    }\n  }\n}`,
    })
  );
}
app.use(cookieParser());
app.use(bodyParser.json());
app.use(apolloUploadExpress());
app.use(
  session({
    store: sessionStore,
    secret: COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Redirect the user to Twitter for authentication.  When complete, Twitter
// will redirect the user back to the application at
//   /auth/twitter/callback
app.get('/auth/twitter', passport.authenticate('twitter'));

const IS_SPECTRUM_URL = /^(https?:\/\/)?(\w|-)*\.?spectrum.chat(\w+|\/)*$/i;
// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', {
    failureRedirect: IS_PROD ? '/' : 'http://localhost:3000/',
  }),
  (req, res) => {
    let url = IS_PROD ? '/home' : 'http://localhost:3000/home';
    if (req.query.r && IS_SPECTRUM_URL.test(req.query.r)) {
      url = req.query.r;
    }
    res.redirect(url);
  }
);
app.get('/auth/logout', (req, res) => {
  var sessionCookie = req.cookies['connect.sid'];
  const HOME = IS_PROD ? '/' : 'http://localhost:3000/';
  if (req.isUnauthenticated() || !sessionCookie) {
    return res.redirect(HOME);
  }
  var sessionId = sessionCookie.split('.')[0].replace('s:', '');
  return destroySession(sessionId)
    .then(() => {
      // I should not have to do this manually
      // but it doesn't work otherwise ¯\_(ツ)_/¯
      res.clearCookie('connect.sid');
      req.logout();
      res.redirect(HOME);
    })
    .catch(err => {
      res.clearCookie('connect.sid');
      console.log(err);
      res.redirect(HOME);
    });
});
app.use(
  '/api',
  graphqlExpress(req => ({
    schema,
    formatError: error => {
      console.log(error);
      const sentryId = Raven.captureException(
        error,
        Raven.parsers.parseRequest(req)
      );
      const isUserError = error.originalError
        ? error.originalError[IsUserError]
        : false;
      return {
        message: isUserError
          ? error.message
          : `Internal server error: ${sentryId}`,
        stack: !IS_PROD ? error.stack.split('\n') : null,
      };
    },
    context: {
      user: req.user,
      loaders: createLoaders(),
      opticsContext: OpticsAgent.context(req),
    },
  }))
);

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
const sessionCookieParser = cookieParser(COOKIE_SECRET);
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
            if (err || !session || !session.passport)
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
