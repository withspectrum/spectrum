import { Router } from 'express';
import jwt from 'jsonwebtoken';

const middlewares = Router();

if (process.env.NODE_ENV === 'development') {
  const logging = require('shared/middlewares/logging');
  middlewares.use(logging);
}

if (process.env.NODE_ENV === 'production' && !process.env.FORCE_DEV) {
  // Raven (Sentry client) needs to come before everything else
  const raven = require('shared/middlewares/raven').default;
  middlewares.use(raven);
}

middlewares.use((req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.replace(/^\s*Bearer\s*/, '');
    try {
      const decoded = jwt.verify(token, process.env.API_TOKEN_SECRET);
      if (decoded.cookie) req.headers.cookie = decoded.cookie;
    } catch (err) {}
  }
  next();
});

// Cross origin request support
import cors from 'shared/middlewares/cors';
middlewares.use(cors);
middlewares.options('*', cors);

import cookieParser from 'cookie-parser';
middlewares.use(cookieParser());

import bodyParser from 'body-parser';
middlewares.use(bodyParser.json());

import { apolloUploadExpress } from 'apollo-upload-server';
middlewares.use(
  apolloUploadExpress({
    maxFileSize: 25 * 1024 * 1024, // 25MB
  })
);

import session from 'shared/middlewares/session';
middlewares.use(session);

import passport from 'passport';
middlewares.use(passport.initialize());
middlewares.use(passport.session());

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
