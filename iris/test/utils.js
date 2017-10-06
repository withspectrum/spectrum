// @flow
import { graphql } from 'graphql';
import createLoaders from '../loaders';

import schema from '../schema';

// Nice little helper function for tests
export const request = (query: mixed) =>
  graphql(schema, query, undefined, { loaders: createLoaders() });
