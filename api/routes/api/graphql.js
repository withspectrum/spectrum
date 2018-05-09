// @flow
import { graphqlExpress } from 'graphql-server-express';
import depthLimit from 'graphql-depth-limit';
import costAnalysis from 'graphql-cost-analysis';
import UserError from '../../utils/UserError';
import createLoaders from '../../loaders/';
import createErrorFormatter from '../../utils/create-graphql-error-formatter';
import schema from '../../schema';
import { track } from 'shared/analytics';

export default graphqlExpress(req => {
  const loaders = createLoaders();

  let currentUser = req.user && !req.user.bannedAt ? req.user : null;

  /*
    Simplify tracking calls in mutations. If a mutation causes multiple
    tracking events for different users, a userId field in the props
    will become the user id tagged in downstream analytics providers
  */
  const trackContext = (event: string, props: Object = {}) => {
    const { userId, ...rest } = props;
    const user = userId || req.user.id;
    return track(user, event, rest);
  };

  return {
    schema,
    formatError: createErrorFormatter(req),
    context: {
      loaders,
      user: currentUser,
      track: trackContext,
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
