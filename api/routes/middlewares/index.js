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

// This needs to come after passport otherwise we'll always redirect logged-in users
import threadParamRedirect from 'shared/middlewares/thread-param';
middlewares.use(threadParamRedirect);

export default middlewares;
