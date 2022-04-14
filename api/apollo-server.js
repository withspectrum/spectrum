// @flow
const debug = require('debug')('api:graphql');
import { ApolloServer } from 'apollo-server-express';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import depthLimit from 'graphql-depth-limit';
import costAnalysis from 'graphql-cost-analysis';
import { RedisCache } from 'apollo-server-cache-redis';
import { config } from 'shared/cache/redis';
import createLoaders from './loaders';
import createErrorFormatter from './utils/create-graphql-error-formatter';
import schema from './schema';
import { setUserOnline } from 'shared/db/queries/user';
import { statsd } from 'shared/statsd';
import { getUserIdFromReq } from './utils/session-store';
import UserError from './utils/UserError';
import type { DBUser } from 'shared/types';

// NOTE(@mxstbr): Evil hack to make graphql-cost-analysis work with Apollo Server v2
// @see pa-bru/graphql-cost-analysis#12
// @author @arianon
class ProtectedApolloServer extends ApolloServer {
  async createGraphQLServerOptions(
    req: express$Request,
    res: express$Response
  ): Promise<*> {
    const options = await super.createGraphQLServerOptions(req, res);

    return {
      ...options,
      validationRules: [
        ...options.validationRules,
        costAnalysis({
          maximumCost: 750,
          defaultCost: 1,
          variables: req.body.variables,
          createError: (max, actual) => {
            const err = new UserError(
              `GraphQL query exceeds maximum complexity, please remove some nesting or fields and try again. (max: ${max}, actual: ${actual})`
            );
            return err;
          },
        }),
      ],
    };
  }
}

let connections = 0;

setInterval(() => {
  statsd.gauge('websocket.connections.count', connections);
}, 5000);

const server = new ProtectedApolloServer({
  schema,
  formatError: createErrorFormatter(),
  // For subscriptions, this gets passed "connection", for everything else "req" and "res"
  context: ({ req, res, connection, ...rest }, ...other) => {
    if (connection) {
      return {
        ...(connection.context || {}),
      };
    }

    // Add GraphQL operation information to the statsd tags
    req.statsdTags = {
      graphqlOperationName: req.body.operationName || 'unknown_operation',
    };
    debug(req.body.operationName || 'unknown_operation');
    const loaders = createLoaders();
    let currentUser = req.user && !req.user.bannedAt ? req.user : null;

    return {
      loaders,
      updateCookieUserData: (data: DBUser) =>
        new Promise((res, rej) =>
          req.login(data, err => (err ? rej(err) : res()))
        ),
      req,
      user: currentUser,
    };
  },
  subscriptions: {
    path: '/websocket',
    onDisconnect: rawSocket => {
      connections--;
      return getUserIdFromReq(rawSocket.upgradeReq)
        .then(id => id && setUserOnline(id, false))
        .catch(err => {
          console.error(err);
        });
    },
    onConnect: (connectionParams, rawSocket) => {
      connections++;
      return getUserIdFromReq(rawSocket.upgradeReq)
        .then(id => (id ? setUserOnline(id, true) : null))
        .then(user => {
          return {
            user: user || null,
            loaders: createLoaders({ cache: false }),
          };
        })
        .catch(err => {
          console.error(err);
          return {
            loaders: createLoaders({ cache: false }),
          };
        });
    },
  },
  playground: process.env.NODE_ENV !== 'production' && {
    settings: {
      'editor.theme': 'light',
    },
    tabs: [
      {
        endpoint: 'http://localhost:3001/api',
        query: `{
  user(username: "mxstbr") {
    id
    username
  }
}`,
      },
    ],
  },
  introspection: process.env.NODE_ENV !== 'production',
  maxFileSize: 25 * 1024 * 1024, // 25MB
  engine: false,
  tracing: false,
  validationRules: [depthLimit(10)],
  cacheControl: {
    calculateHttpHeaders: false,
    // Cache everything for at least a minute since we only cache public responses
    defaultMaxAge: 60,
  },
  cache: new RedisCache({
    ...config,
    prefix: 'apollo-cache:',
  }),
  plugins: [
    responseCachePlugin({
      sessionId: ({ context }) => (context.user ? context.user.id : null),
      // Only cache public responses
      shouldReadFromCache: ({ context }) => !context.user,
      shouldWriteToCache: ({ context }) => !context.user,
    }),
  ],
});

export default server;
