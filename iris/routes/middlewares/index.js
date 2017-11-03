import { Router } from 'express';

const middlewares = Router();

if (process.env.NODE_ENV === 'development') {
  const logging = require('./logging');
  middlewares.use(logging);
}

if (process.env.NODE_ENV === 'production' && !process.env.FORCE_DEV) {
  // Raven (Sentry client) needs to come before everything else
  const raven = require('./raven').default;
  middlewares.use(raven);
}

// Apollo Optics middleware
import OpticsAgent from 'optics-agent';
middlewares.use(OpticsAgent.middleware());

// Cross origin request support
import cors from './cors';
middlewares.use(cors);

import cookieParser from 'cookie-parser';
middlewares.use(cookieParser());

import bodyParser from 'body-parser';
middlewares.use(bodyParser.json());

import { apolloUploadExpress } from 'apollo-upload-server';
middlewares.use(apolloUploadExpress());

import session from './session';
middlewares.use(session);

import passport from 'passport';
middlewares.use(passport.initialize());
middlewares.use(passport.session());

// This needs to come after passport otherwise we'll always redirect logged-in users
import threadParamRedirect from './thread-param';
middlewares.use(threadParamRedirect);

export default middlewares;
