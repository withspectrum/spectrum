// @flow
import { graphqlExpress } from 'apollo-server-express';
import createLoaders from '../../loaders/';

import createErrorFormatter from '../../utils/create-graphql-error-formatter';
import schema from '../../schema';

export default graphqlExpress(req => ({
  schema,
  tracing: true,
  cacheControl: true,
  formatError: createErrorFormatter(req),
  context: {
    user: req.user,
    loaders: createLoaders(),
  },
}));
