import { Router } from 'express';

const middlewares = Router();

import bodyParser from 'body-parser';
middlewares.use(bodyParser.json());

if (process.env.NODE_ENV === 'development') {
  const logging = require('shared/middlewares/logging');
  middlewares.use(logging);
}

if (process.env.NODE_ENV === 'production' && !process.env.FORCE_DEV) {
  // Raven (Sentry client) needs to come before everything else
  const raven = require('shared/middlewares/raven').default;
  middlewares.use(raven);
}

// Cross origin request support
import cors from 'shared/middlewares/cors';
middlewares.use(cors);
middlewares.options('*', cors);

import cookieParser from 'cookie-parser';
middlewares.use(cookieParser());

import session from 'shared/middlewares/session';
middlewares.use(session);

import passport from 'passport';
middlewares.use(passport.initialize());
middlewares.use(passport.session());

// Refresh authenticated users expiry time
middlewares.use((req, res, next) => {
  if (req.session && req.user) {
    req.session.lastRequest = Date.now();
  }
  next();
});

const isSerializedJSON = str => str[0] === '{';

// NOTE(@mxstbr): If a logged-in user with a legacy cookie (just the user ID) sends a request
// we add all the user data to the cookie (by calling req.login) to move them to the new cookie
// format.
// @see #3944
// @see https://stackoverflow.com/a/24498660
middlewares.use((req, res, next) => {
  if (
    req.session &&
    req.session.passport &&
    typeof req.session.passport.user === 'string' &&
    !isSerializedJSON(req.session.passport.user[0]) &&
    req.user
  ) {
    req.login(req.user, () => {
      next();
    });
    return;
  }

  next();
});

// This needs to come after passport otherwise we'll always redirect logged-in users
import threadParamRedirect from 'shared/middlewares/thread-param';
middlewares.use(threadParamRedirect);

export default middlewares;
