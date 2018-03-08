// @flow
/**
 * The entry point for the server, this is where everything starts
 */
console.log('Server starting...');
const compression = require('compression');
const debug = require('debug')('iris');
debug('logging with debug enabled!');
import { createServer } from 'http';
import express from 'express';
import Raven from 'shared/raven';
import { ApolloEngine } from 'apollo-engine';
import { init as initPassport } from './authentication.js';
import type { DBUser } from 'shared/types';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

const engine = new ApolloEngine({
  logging: {
    level: 'WARN',
  },
  apiKey: process.env.APOLLO_ENGINE_API_KEY,
  // Only send perf data to the remote server in production
  reporting: {
    disabled: process.env.NODE_ENV !== 'production',
    hostname: process.env.NOW_URL || undefined,
    privateHeaders: ['authorization', 'Authorization', 'AUTHORIZATION'],
  },
});

// Initialize authentication
initPassport();

// API server
const app = express();

// Trust the now proxy
app.set('trust proxy', true);

// Send all responses as gzip
app.use(compression());

import middlewares from './routes/middlewares';
app.use(middlewares);

import authRoutes from './routes/auth';
app.use('/auth', authRoutes);

import apiRoutes from './routes/api';
app.use('/api', apiRoutes);

import type { Loader } from './loaders/types';
export type GraphQLContext = {
  user: DBUser,
  loaders: {
    [key: string]: Loader,
  },
};

const server = createServer(app);

// Create subscriptions server at /websocket
import createSubscriptionsServer from './routes/create-subscription-server';
const subscriptionsServer = createSubscriptionsServer(server, '/websocket');

// Start API wrapped in Apollo Engine
engine.listen({
  port: PORT,
  httpServer: server,
  graphqlPaths: ['/api'],
});
console.log(`GraphQL server running at http://localhost:${PORT}/api`);

process.on('unhandledRejection', async err => {
  console.error('Unhandled rejection', err);
  try {
    await new Promise(resolve => Raven.captureException(err, resolve));
  } catch (err) {
    console.error('Raven error', err);
  } finally {
    process.exit(1);
  }
});

process.on('uncaughtException', async err => {
  console.error('Uncaught exception', err);
  try {
    await new Promise(resolve => Raven.captureException(err, resolve));
  } catch (err) {
    console.error('Raven error', err);
  } finally {
    process.exit(1);
  }
});
