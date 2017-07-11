// @flow
import { graphqlExpress } from 'graphql-server-express';
import OpticsAgent from 'optics-agent';
import createLoaders from '../../loaders/';

import createErrorFormatter from '../../utils/create-graphql-error-formatter';
import schema from '../../schema';

export default graphqlExpress(req => ({
  schema,
  formatError: createErrorFormatter(req),
  context: {
    user: req.user,
    loaders: createLoaders(),
    opticsContext: OpticsAgent.context(req),
  },
}));
