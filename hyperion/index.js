// @flow
const debug = require('debug')('hyperion');
import 'raf/polyfill';
debug('Hyperion starting...');
debug('logging with debug enabled');
require('isomorphic-fetch'); // prevent https://github.com/withspectrum/spectrum/issues/3032
import fs from 'fs';
import statsd from 'shared/middlewares/statsd';
import express from 'express';
import Loadable from 'react-loadable';
import path from 'path';
// TODO: This is the only thing that connects hyperion to the db
// we should get rid of this if at all possible
import { getUserById } from 'shared/db/queries/user';
import Raven from 'shared/raven';
import toobusy from 'shared/middlewares/toobusy';
import rateLimiter from 'shared/middlewares/rate-limiter';
import addSecurityMiddleware from 'shared/middlewares/security';
import { createProxyMiddleware } from 'http-proxy-middleware';

const PORT = process.env.PORT || 3006;
const ONE_HOUR = 3600;

const app = express();

// Instantiate the statsd middleware as soon as possible to get accurate time tracking
app.use(statsd);

// Trust the now proxy
app.set('trust proxy', true);

app.use(toobusy);

// Security middleware.
addSecurityMiddleware(app, { enableNonce: true, enableCSP: true });

app.use(
  ['/api', '/api/**'],
  createProxyMiddleware({
    target: 'https://api.spectrum.chat',
    changeOrigin: true,
  })
);

app.use(
  ['/auth', '/auth/**'],
  createProxyMiddleware({
    target: 'https://api.spectrum.chat',
    changeOrigin: true,
  })
);

app.use(
  ['/websocket', '/websocket/**'],
  createProxyMiddleware({
    target: 'https://api.spectrum.chat',
    changeOrigin: true,
    ws: true,
  })
);

// Serve static files from the build folder
app.use(
  express.static(
    process.env.NODE_ENV === 'production'
      ? './build'
      : path.join(__dirname, '../build/'),
    {
      index: false,
      setHeaders: (res, path) => {
        // Don't cache the serviceworker in the browser
        if (path.indexOf('sw.js') > -1) {
          res.setHeader('Cache-Control', 'no-store, no-cache');
          return;
        }

        if (path.endsWith('.js')) {
          // Cache static files in now CDN for seven days
          // (the filename changes if the file content changes, so we can cache these forever)
          res.setHeader('Cache-Control', `s-maxage=${ONE_HOUR}`);
        }
      },
    }
  )
);

// In dev the static files from the root public folder aren't moved to the build folder by create-react-app
// so we just tell Express to serve those too
if (process.env.NODE_ENV === 'development') {
  app.use(
    express.static(path.resolve(__dirname, '..', 'public'), { index: false })
  );
}

app.use(
  rateLimiter({
    max: 13,
    duration: '20s',
  })
);

import bodyParser from 'body-parser';
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'development') {
  const logging = require('shared/middlewares/logging');
  app.use(logging);
}

if (process.env.NODE_ENV === 'production' && !process.env.FORCE_DEV) {
  // Raven (Sentry client) needs to come before everything else
  const raven = require('shared/middlewares/raven').default;
  app.use(raven);
}

// Cross origin request support
import cors from 'shared/middlewares/cors';
app.use(cors);

// In development the Webpack HMR server requests /sockjs-node constantly,
// so let's patch that through to it!
if (process.env.NODE_ENV === 'development') {
  app.use('/sockjs-node', (req: express$Request, res: express$Response) => {
    res.redirect(301, `http://localhost:3000${req.path}`);
  });
}

import cookieParser from 'cookie-parser';
app.use(cookieParser());

import session from 'shared/middlewares/session';
app.use(session);

import passport from 'passport';
// Setup use serialization
passport.serializeUser((user, done) => {
  done(null, typeof user === 'string' ? user : JSON.stringify(user));
});

// NOTE(@mxstbr): `data` used to be just the userID, but is now the full user data
// to avoid having to go to the db on every single request. We have to handle both
// cases here, as more and more users use Spectrum again we go to the db less and less
passport.deserializeUser((data, done) => {
  // Fast path: try to JSON.parse the data if it works, we got the user data, yay!
  try {
    const user = JSON.parse(data);
    // Make sure more than the user ID is in the data by checking any other required
    // field for existence
    if (user.id && user.createdAt) {
      return done(null, user);
    }
    // Ignore JSON parsing errors
  } catch (err) {}

  // Slow path: data is just the userID (legacy), so we have to go to the db to get the full data
  getUserById(data)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err);
    });
});
app.use(passport.initialize());
app.use(passport.session());

// This needs to come after passport otherwise we'll always redirect logged-in users
import threadParamRedirect from 'shared/middlewares/thread-param';
app.use(threadParamRedirect);

app.get('*', (req: express$Request, res, next) => {
  // Electron requests should only be client-side rendered
  if (
    req.headers['user-agent'] &&
    req.headers['user-agent'].indexOf('Electron') > -1
  ) {
    return res.sendFile(path.resolve(__dirname, '../build/index.html'));
  }
  next();
});

import renderer from './renderer';
app.get('*', renderer);

process.on('unhandledRejection', async err => {
  console.error('Unhandled rejection', err);
  try {
    await new Promise(res => Raven.captureException(err, res));
  } catch (err) {
    console.error('Raven error', err);
  } finally {
    process.exit(1);
  }
});

process.on('uncaughtException', async err => {
  console.error('Uncaught exception', err);
  try {
    await new Promise(res => Raven.captureException(err, res));
  } catch (err) {
    console.error('Raven error', err);
  } finally {
    process.exit(1);
  }
});

Loadable.preloadAll().then(() => {
  app.listen(PORT);
  debug(
    `Hyperion, the server-side renderer, running at http://localhost:${PORT}`
  );
});
