// @flow
const debug = require('debug')('iris:utils:error-formatter');
import Raven from 'raven';
import { IsUserError } from './UserError';
import type { GraphQLError } from 'graphql';

const createGraphQLErrorFormatter = (req?: express$Request) => (
  error: GraphQLError
) => {
  debug('---GraphQL Error---');
  debug(error);
  debug('-------------------\n');
  const isUserError = error.originalError
    ? error.originalError[IsUserError]
    : error[IsUserError];
  let sentryId = 'ID only generated in production';
  if (!isUserError) {
    if (process.env.NODE_ENV === 'production') {
      sentryId = Raven.captureException(
        error,
        req && Raven.parsers.parseRequest(req)
      );
    }
  }
  return {
    message: isUserError ? error.message : `Internal server error: ${sentryId}`,
    // Hide the stack trace in production mode
    stack:
      !process.env.NODE_ENV === 'production' ? error.stack.split('\n') : null,
  };
};

export default createGraphQLErrorFormatter;
