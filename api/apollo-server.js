// @flow
import { ApolloServer } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import costAnalysis from 'graphql-cost-analysis';
import createLoaders from './loaders';
import createErrorFormatter from './utils/create-graphql-error-formatter';
import schema from './schema';
import { getUser, setUserOnline } from './models/user';
import { getUserIdFromReq } from './utils/session-store';

const server = new ApolloServer({
  schema,
  formatError: createErrorFormatter(),
  // For subscriptions, this gets passed "connection", for everything else "req" and "res"
  context: ({ req, res, connection }) => {
    if (connection) {
      return {};
    }

    const loaders = createLoaders();
    let currentUser = req.user && !req.user.bannedAt ? req.user : null;

    return {
      loaders,
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
  // validationRules: [
  //   depthLimit(10),
  //   costAnalysis({
  //     variables: req.body.variables,
  //     maximumCost: 750,
  //     defaultCost: 1,
  //     createError: (max, actual) => {
  //       const err = new UserError(
  //         `GraphQL query exceeds maximum complexity, please remove some nesting or fields and try again. (max: ${max}, actual: ${actual})`
  //       );
  //       return err;
  //     },
  //   }),
  // ],
});

export default server;
