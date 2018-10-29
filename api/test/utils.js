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
      getImageSignatureExpiration: () => {
        /*
          Expire images sent to the client at midnight each day (UTC).
          Expiration needs to be consistent across all images in order
          to preserve client-side caching abilities and to prevent checksum
          mismatches during SSR
        */
        const date = new Date();
        date.setHours(24);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date.getTime();
      },
      ...context,
    },
    variables
  );
};
