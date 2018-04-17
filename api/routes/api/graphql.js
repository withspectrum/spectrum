// @flow
import { graphqlExpress } from 'graphql-server-express';
import depthLimit from 'graphql-depth-limit';
import costAnalysis from 'graphql-cost-analysis';
import rateLimiter from '../../utils/graphql-rate-limiter';
import Raven from 'shared/raven';
import UserError from '../../utils/UserError';
import createLoaders from '../../loaders/';

import createErrorFormatter from '../../utils/create-graphql-error-formatter';
import schema from '../../schema';

import { parse } from 'graphql';

export default graphqlExpress(async req => {
  if (!req.body.query) throw new Error('No query provided.');
  let doc;
  try {
    doc = parse(req.body.query);
    // Ignore any errors that happen while parsing and let graphql-express handle them
  } catch (err) {}
  if (doc) {
    await rateLimiter({
      doc,
      schema,
      id: (req.user && req.user.id) || 'anonymous',
    });
  }
  return {
    schema,
    formatError: createErrorFormatter(req),
    context: {
      user: req.user ? (req.user.bannedAt ? null : req.user) : null,
      loaders: createLoaders(),
    },
    validationRules: [
      depthLimit(10),
      costAnalysis({
        variables: req.body.variables,
        maximumCost: 750,
        defaultCost: 1,
        createError: (max, actual) => {
          const err = new UserError(
            `GraphQL query exceeds maximum complexity, please remove some nesting or fields and try again. (max: ${max}, actual: ${actual})`
          );
          return err;
        },
      }),
    ],
  };
});
