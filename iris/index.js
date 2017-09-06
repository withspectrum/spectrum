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

// In production use express to serve the React app
// In development this is done by react-scripts, which starts its own server
if (IS_PROD) {
  const { graphql } = require('graphql');
  // Load index.html into memory
  var index = fs
    .readFileSync(path.resolve(__dirname, '..', 'build', 'index.html'))
    .toString();
  app.use(
    express.static(path.resolve(__dirname, '..', 'build'), { index: false })
  );
  app.get('*', function(req, res) {
    getMeta(req.url, (query: string): Promise =>
      graphql(schema, query, undefined, {
        loaders: createLoaders(),
        user: req.user,
      })
    ).then(({ title, description, extra }) => {
      // In production inject the meta title and description
      res.send(
        index
          // Replace "Spectrum" with proper title, but make sure to not replace the twitter site:name
          // (which is set to Spectrum.chat)
          .replace(/Spectrum(?!\.chat)/g, title)
          // Replace "Where communities live." with proper description for page
          .replace(/Where communities live\./g, description)
          // Add any extra meta tags at the end
          .replace(/<meta name="%OG_EXTRA%">/g, extra || '')
      );
    });
  });
}

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
console.log(`GraphQL server running at port ${PORT}!`);
