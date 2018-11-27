// @flow
import { graphql } from 'graphql';
import createLoaders from '../loaders';
import schema from '../schema';

type Options = {
  context?: {
    user?: ?Object,
  },
  variables?: ?Object,
};

// Nice little helper function for tests
export const request = (query: mixed, { context, variables }: Options = {}) => {
  return graphql(
    schema,
    query,
    undefined,
    {
      loaders: createLoaders(),
      ...context,
    },
    variables
  );
};
