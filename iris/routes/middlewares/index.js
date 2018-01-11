import { Router } from 'express';

const middlewares = Router();

if (process.env.NODE_ENV === 'development') {
  const logging = require('shared/middlewares/logging');
  middlewares.use(logging);
}

// Start apollo engine
if (process.env.NODE_ENV === 'production' && !process.env.FORCE_DEV) {
  const engine = require('./engine').default;
  console.log('Apollo Engine starting...');
  engine.start();
  middlewares.use(engine.expressMiddleware());
}

if (process.env.NODE_ENV === 'production' && !process.env.FORCE_DEV) {
  // Raven (Sentry client) needs to come before everything else
  const raven = require('shared/middlewares/raven').default;
  middlewares.use(raven);
}

// Cross origin request support
import cors from 'shared/middlewares/cors';
middlewares.use(cors);

import cookieParser from 'cookie-parser';
middlewares.use(cookieParser());

import bodyParser from 'body-parser';
middlewares.use(bodyParser.json());

import { apolloUploadExpress } from 'apollo-upload-server';
middlewares.use(apolloUploadExpress());

import session from 'shared/middlewares/session';
middlewares.use(session);

import passport from 'passport';
middlewares.use(passport.initialize());
middlewares.use(passport.session());

// This needs to come after passport otherwise we'll always redirect logged-in users
import threadParamRedirect from 'shared/middlewares/thread-param';
middlewares.use(threadParamRedirect);

export default middlewares;
