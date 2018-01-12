// @flow
import { graphql } from 'graphql';
import createLoaders from '../loaders';

import schema from '../schema';

type Options = {
  context?: {
    user?: Object,
  },
};

// Nice little helper function for tests
export const request = (
  query: mixed,
  { context }: Options = {},
  variables: Object = {}
) =>
  graphql(
    schema,
    query,
    undefined,
    { loaders: createLoaders(), ...context },
    variables
  );
