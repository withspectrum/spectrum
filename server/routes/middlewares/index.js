// @flow
import { Router } from 'express';

const middlewares = Router();

// Raven (Sentry client) needs to come before everything else
import raven from './raven';
middlewares.use(raven);

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

export default middlewares;
