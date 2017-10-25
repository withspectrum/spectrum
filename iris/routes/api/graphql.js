// @flow
import { graphqlExpress } from 'graphql-server-express';
import createLoaders from '../../loaders/';

import createErrorFormatter from '../../utils/create-graphql-error-formatter';
import schema from '../../schema';

export default graphqlExpress(req => ({
  schema,
  formatError: createErrorFormatter(req),
  tracing: true,
  cacheControl: true,
  context: {
    user: req.user,
    loaders: createLoaders(),
  },
}));
