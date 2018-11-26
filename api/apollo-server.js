// @flow
import { ApolloServer } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import costAnalysis from 'graphql-cost-analysis';
import createLoaders from './loaders';
import createErrorFormatter from './utils/create-graphql-error-formatter';
import schema from './schema';
import { setUserOnline } from 'shared/db/queries/user';
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

    const loaders = createLoaders();
    let currentUser = req.user && !req.user.bannedAt ? req.user : null;

    return {
      loaders,
      updateCookieUserData: (data: DBUser) =>
        new Promise((res, rej) =>
          req.login(data, err => (err ? rej(err) : res()))
        ),
      user: currentUser,
    };
  },
  subscriptions: {
    path: '/websocket',
    onOperation: (_: any, params: Object) => {
      const errorFormatter = createErrorFormatter();
      params.formatError = errorFormatter;
      return params;
    },
    onDisconnect: rawSocket => {
      return getUserIdFromReq(rawSocket.upgradeReq)
        .then(id => id && setUserOnline(id, false))
        .catch(err => {
          console.error(err);
        });
    },
    onConnect: (connectionParams, rawSocket) =>
      getUserIdFromReq(rawSocket.upgradeReq)
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
        }),
  },
  playground: {
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
  maxFileSize: 25 * 1024 * 1024, // 25MB
  engine: false,
  tracing: false,
  cacheControl: false,
  validationRules: [depthLimit(10)],
});

export default server;
