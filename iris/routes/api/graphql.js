// @flow
import { graphqlExpress } from 'graphql-server-express';
import depthLimit from 'graphql-depth-limit';
import costAnalysis from 'graphql-cost-analysis';
import createLoaders from '../../loaders/';

import createErrorFormatter from '../../utils/create-graphql-error-formatter';
import schema from '../../schema';

export default graphqlExpress(req => ({
  schema,
  formatError: createErrorFormatter(req),
  context: {
    user: req.user,
    loaders: createLoaders(),
  },
  validationRules: [
    depthLimit(10),
    costAnalysis({
      variables: req.body.variables,
      maximumCost: 750,
      defaultCost: 1,
    }),
  ],
  tracing: true,
}));
