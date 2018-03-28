// @flow
console.log('Hyperion starting...');
const debug = require('debug')('hyperion');
debug('logging with debug enabled');
// $FlowFixMe
require('isomorphic-fetch');
import express from 'express';
import Loadable from 'react-loadable';
import path from 'path';
import { getUser } from 'api/models/user';
import Raven from 'shared/raven';
import toobusy from 'shared/middlewares/toobusy';

const PORT = process.env.PORT || 3006;

const app = express();

// Trust the now proxy
app.set('trust proxy', true);

app.use(toobusy);

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

// Redirect requests to /api and /auth to the production API
// This allows deploy previews to work, as this route would only be called
// if there's no path alias in Now for hyperionurl.com/api, which would only
// happen on deploy previews
app.use('/api', (req: express$Request, res: express$Response) => {
  const redirectUrl = `${req.baseUrl}${req.path}`;
  res.redirect(
    req.method === 'POST' || req.xhr ? 307 : 301,
    `https://spectrum.chat${redirectUrl}`
  );
});

app.use('/auth', (req: express$Request, res: express$Response) => {
  const redirectUrl = `${req.baseUrl}${req.path}`;
  res.redirect(
    req.method === 'POST' || req.xhr ? 307 : 301,
    `https://spectrum.chat${redirectUrl}`
  );
});

app.use('/websocket', (req: express$Request, res: express$Response) => {
  const redirectUrl = `${req.baseUrl}${req.path}`;
  res.redirect(
    req.method === 'POST' || req.xhr ? 307 : 301,
    `https://spectrum.chat${redirectUrl}`
  );
});

// In development the Webpack HMR server requests /sockjs-node constantly,
// so let's patch that through to it!
if (process.env.NODE_ENV === 'development') {
  app.use('/sockjs-node', (req: express$Request, res: express$Response) => {
    res.redirect(301, `http://localhost:3000${req.path}`);
  });
}

import cookieParser from 'cookie-parser';
app.use(cookieParser());

import bodyParser from 'body-parser';
app.use(bodyParser.json());

import session from 'shared/middlewares/session';
app.use(session);

import passport from 'passport';
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  getUser({ id })
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

// Static files
app.use(
  express.static(path.resolve(__dirname, '..', 'build'), { index: false })
);

// In dev the static files from the root public folder aren't moved to the build folder by create-react-app
// so we just tell Express to serve those too
if (process.env.NODE_ENV === 'development') {
  app.use(
    express.static(path.resolve(__dirname, '..', 'public'), { index: false })
  );
}

import cache from './cache';
app.use(cache);

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
  console.log(
    `Hyperion, the server-side renderer, running at http://localhost:${PORT}`
  );
});
