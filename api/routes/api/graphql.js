// @flow
import { graphqlExpress } from 'graphql-server-express';
import depthLimit from 'graphql-depth-limit';
import costAnalysis from 'graphql-cost-analysis';
import { crunch } from 'graphql-crunch';
import UserError from '../../utils/UserError';
import createLoaders from '../../loaders/';
import createErrorFormatter from '../../utils/create-graphql-error-formatter';
import schema from '../../schema';

export default graphqlExpress(req => {
  const loaders = createLoaders();

  let currentUser = req.user && !req.user.bannedAt ? req.user : null;

  return {
    schema,
    formatError: createErrorFormatter(req),
    formatResponse: response => {
      if (
        req.query.crunch !== undefined &&
        response.data &&
        !response.data.__schema
      ) {
        response.data = crunch(response.data);
      }

      return response;
    },
    context: {
      loaders,
      user: currentUser,
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
