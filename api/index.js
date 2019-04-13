// @flow
/**
 * The entry point for the server, this is where everything starts
 */
const compression = require('compression');
const debug = require('debug')('api');
debug('Server starting...');
debug('logging with debug enabled!');
import { createServer } from 'http';
import express from 'express';
import Raven from 'shared/raven';
import toobusy from 'shared/middlewares/toobusy';
import addSecurityMiddleware from 'shared/middlewares/security';
import csrf from 'shared/middlewares/csrf';
import statsd from 'shared/middlewares/statsd';
import { init as initPassport } from './authentication.js';
import apolloServer from './apollo-server';
import { corsOptions } from 'shared/middlewares/cors';
import errorHandler from 'shared/middlewares/error-handler';
import rateLimiter from 'shared/middlewares/rate-limiter';
import middlewares from './routes/middlewares';
import authRoutes from './routes/auth';
import apiRoutes from './routes/api';
import type { DBUser } from 'shared/types';
import type { Loader } from './loaders/types';

export type GraphQLContext = {
  user: DBUser,
  updateCookieUserData: (data: DBUser) => Promise<void>,
  loaders: {
    [key: string]: Loader,
  },
};

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

initPassport();

const app = express();

// Instantiate the statsd middleware as soon as possible to get accurate time tracking
app.use(statsd);

// Trust the now proxy
app.set('trust proxy', true);
app.use(toobusy);

if (!process.env.TEST_DB) {
  // Allow bursts of up to 40 req for initial page loads, but block more than 40 / 10s
  app.use(
    rateLimiter({
      max: 40,
      duration: '10s',
    })
  );
}

// Security middleware.
addSecurityMiddleware(app, { enableNonce: false, enableCSP: false });
if (process.env.NODE_ENV === 'production' && !process.env.FORCE_DEV) {
  app.use(csrf);
}

// All other middlewares
app.use(compression());
app.use(middlewares);

// Routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// GraphQL middleware
apolloServer.applyMiddleware({ app, path: '/api', cors: corsOptions });

// Redirect a request to the root path to the main app
app.use('/', (req: express$Request, res: express$Response) => {
  res.redirect(
    process.env.NODE_ENV === 'production' && !process.env.FORCE_DEV
      ? 'https://spectrum.chat'
      : 'http://localhost:3000'
  );
});

// $FlowIssue
app.use(errorHandler);

// We need to create a separate HTTP server to handle GraphQL subscriptions via websockets
const httpServer = createServer(app);
apolloServer.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT);

debug(`GraphQL API running at http://localhost:${PORT}/api`);

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
