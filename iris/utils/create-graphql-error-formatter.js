import Raven from 'raven';
import { IsUserError } from './UserError';

const createGraphQLErrorFormatter = req => error => {
  const isUserError = error.originalError
    ? error.originalError[IsUserError]
    : false;
  let sentryId = 'ID only generated in production';
  if (!isUserError) {
    console.log(error);
    if (process.env.NODE_ENV === 'production') {
      sentryId = Raven.captureException(error, Raven.parsers.parseRequest(req));
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
