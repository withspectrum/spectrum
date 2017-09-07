// @flow
/**
 * The entry point for the server, this is where everything starts
 */
console.log('Server starting...');
const debug = require('debug')('iris');
debug('logging with debug enabled!');
import path from 'path';
import fs from 'fs';
import { createServer } from 'http';
//$FlowFixMe
import express from 'express';
import * as graphql from 'graphql';

import schema from './schema';
import { init as initPassport } from './authentication.js';
import createLoaders from './loaders';
import getMeta from './utils/get-page-meta';
import listeners from './subscriptions/listeners';

const IS_PROD = process.env.NODE_ENV === 'production';

const PORT = 3001;

// Initialize authentication
initPassport();
// API server
const app = express();

import middlewares from './routes/middlewares';
app.use(middlewares);

import authRoutes from './routes/auth';
app.use('/auth', authRoutes);

import apiRoutes from './routes/api';
app.use('/api', apiRoutes);

import stripeRoutes from './routes/stripe';
app.use('/stripe', stripeRoutes);

// Use express to server-side render the React app
const renderer = require('./renderer').default;
app.use(
  express.static(path.resolve(__dirname, '..', 'build'), { index: false })
);
app.get('*', renderer);

import type { Loader } from './loaders/types';
export type GraphQLContext = {
  user: Object,
  loaders: {
    [key: string]: Loader,
  },
};

const server = createServer(app);

// Create subscriptions server at /websocket
import createSubscriptionsServer from './routes/create-subscription-server';
const subscriptionsServer = createSubscriptionsServer(server, '/websocket');

// Start webserver
server.listen(PORT);

// Start database listeners
listeners.start();
console.log(`GraphQL server running at http://localhost:${PORT}/api`);
console.log(
  `Web server running at http://localhost:${PORT}, server-side rendering enabled`
);
