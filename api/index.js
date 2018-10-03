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
import { ApolloEngine } from 'apollo-engine';
import toobusy from 'shared/middlewares/toobusy';
import addSecurityMiddleware from 'shared/middlewares/security';
import csrf from 'shared/middlewares/csrf';
import { init as initPassport } from './authentication.js';
import apolloServer from './apollo-server';
import { corsOptions } from 'shared/middlewares/cors';
import errorHandler from 'shared/middlewares/error-handler';
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

// Trust the now proxy
app.set('trust proxy', true);
app.use(toobusy);

// Security middleware.
addSecurityMiddleware(app);
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

// Start API wrapped in Apollo Engine
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
  queryCache: {
    // Don't cache logged-in user responses
    privateFullQueryStore: 'disabled',
  },
  sessionAuth: {
    cookie: 'session',
    // TODO(@mxstbr): Ping Apollo to note that we need both of those
    // header: 'Authorization'
  },
});

engine.listen({
  port: PORT,
  httpServer: httpServer,
  graphqlPaths: ['/api'],
});

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
