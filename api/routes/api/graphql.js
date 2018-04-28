// @flow
import { graphqlExpress } from 'graphql-server-express';
import depthLimit from 'graphql-depth-limit';
import costAnalysis from 'graphql-cost-analysis';
import UserError from '../../utils/UserError';
import createLoaders from '../../loaders/';
import permissions from './permissions';

import createErrorFormatter from '../../utils/create-graphql-error-formatter';
import schema from '../../schema';

// const loaders = createLoaders()

export default graphqlExpress(req => {
  const loaders = createLoaders();

  return {
    schema,
    formatError: createErrorFormatter(req),
    context: {
      loaders,
      user:
        !req.user || req.user.bannedAt
          ? null
          : {
              ...req.user,
              communityPermissions: permissions(req.user.id, { loaders })
                .communityPermissions,
              channelPermissions: permissions(req.user.id, { loaders })
                .channelPermissions,
              canManageChannel: permissions(req.user.id, { loaders })
                .canManageChannel,
              canCreateChannel: permissions(req.user.id, { loaders })
                .canCreateChannel,
            },
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
