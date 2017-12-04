// @flow
console.log('Cadmus starting...');
const debug = require('debug')('hyperion');
debug('logging with debug enabled');
// $FlowFixMe
require('isomorphic-fetch');
import express from 'express';
import Loadable from 'react-loadable';
import path from 'path';
import { getUser } from 'iris/models/user';

const PORT = process.env.PORT || 3006;

const app = express();

// Trust the now proxy
app.set('trust proxy', true);

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

import renderer from './renderer';
app.get('*', renderer);

Loadable.preloadAll().then(() => {
  app.listen(PORT);
  console.log(
    `Cadmus, the server-side renderer, running at http://localhost:${PORT}`
  );
});
