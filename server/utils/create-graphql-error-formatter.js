// @flow
import Raven from 'raven';
import { IsUserError } from './UserError';

const createGraphQLErrorFormatter = req => error => {
  console.log(error);
  const sentryId = Raven.captureException(
    error,
    Raven.parsers.parseRequest(req)
  );
  const isUserError = error.originalError
    ? error.originalError[IsUserError]
    : false;
  return {
    message: isUserError ? error.message : `Internal server error: ${sentryId}`,
    // Hide the stack trace in production mode
    stack: !process.env.NODE_ENV === 'production'
      ? error.stack.split('\n')
      : null,
  };
};

export default createGraphQLErrorFormatter;
