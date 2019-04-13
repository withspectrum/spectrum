// @flow
const debug = require('debug')('api:utils:error-formatter');
import { RateLimitError } from 'graphql-rate-limit';
import Raven from 'shared/raven';
import { IsUserError } from './UserError';
import type { GraphQLError } from 'graphql';

const queryRe = /\s*(query|mutation)[^{]*/;

const collectQueries = query => {
  if (!query) return 'No query';
  return query
    .split('\n')
    .map(line => {
      const m = line.match(queryRe);
      return m ? m[0].trim() : '';
    })
    .filter(line => !!line)
    .join('\n');
};

const errorPath = error => {
  if (!error.path) return '';
  return error.path
    .map((value, index) => {
      if (!index) return value;
      return typeof value === 'number' ? `[${value}]` : `.${value}`;
    })
    .join('');
};

const logGraphQLError = (req, error) => {
  debug('---GraphQL Error---');
  debug(error);
  error &&
    error.extensions &&
    error.extensions.exception &&
    debug(error.extensions.exception.stacktrace.join('\n'));
  if (req) {
    debug(collectQueries(req.body.query));
    debug('variables', JSON.stringify(req.body.variables || {}));
  }
  const path = errorPath(error);
  path && debug('path', path);
  debug('-------------------\n');
};

const createGraphQLErrorFormatter = (req?: express$Request) => (
  error: GraphQLError
) => {
  logGraphQLError(req, error);

  const err = error.originalError || error;
  const isUserError = err[IsUserError] || err instanceof RateLimitError;

  let sentryId = 'ID only generated in production';
  if (!isUserError || err instanceof RateLimitError) {
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
