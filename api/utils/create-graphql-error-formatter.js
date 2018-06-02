// @flow
const debug = require('debug')('api:utils:error-formatter');
import Raven from 'shared/raven';
import { IsUserError } from './UserError';
import type { GraphQLError } from 'graphql';
import { Request } from 'api/index';

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
  if (req) {
    debug(collectQueries(req.body.query));
    debug('variables', JSON.stringify(req.body.variables || {}));
  }
  const path = errorPath(error);
  path && debug('path', path);
  debug('-------------------\n');
};

const createGraphQLErrorFormatter = (req?: Request) => (
  error: GraphQLError
) => {
  logGraphQLError(req, error);

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
