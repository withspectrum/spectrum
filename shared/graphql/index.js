// @flow
import { ApolloClient } from 'apollo-client';
import { createUploadLink } from 'apollo-upload-client';
import { RetryLink } from 'apollo-link-retry';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import introspectionQueryResultData from './schema.json';
import getSharedApolloClientOptions from './apollo-client-options';
import { IS_PROD, API_URI, WS_URI } from './constants';

// Fixes a bug with ReactNative, see https://github.com/facebook/react-native/issues/9599
if (typeof global.self === 'undefined') {
  global.self = global;
}

type CreateClientOptions = {
  token?: ?string,
};

// Websocket link for subscriptions
export const wsLink = new WebSocketLink({
  uri: WS_URI,
  options: {
    reconnect: true,
  },
});

// NOTE(@mxstbr): Use the exported client instance from below instead of using this factory!
// Only use this factory if you need to create a new instance of the client with the Authorization token,
// i.e. only use this factory on mobile
export const createClient = (options?: CreateClientOptions = {}) => {
  const cache = new InMemoryCache({
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData,
    }),
    ...getSharedApolloClientOptions(),
  });

  const headers = options.token
    ? {
        authorization: `Bearer ${options.token}`,
      }
    : undefined;

  const retryLink = new RetryLink({
    attempts: (count, operation, error) => {
      const isMutation =
        operation &&
        operation.query &&
        operation.query.definitions &&
        Array.isArray(operation.query.definitions) &&
        operation.query.definitions.some(
          def =>
            def.kind === 'OperationDefinition' && def.operation === 'mutation'
        );

      // Retry mutations for a looong time, those are very important to us so we want them to go through eventually
      if (isMutation) {
        return !!error && count < 25;
      }

      // Retry queries for way less long as this just ends up showing
      // loading indicators for that whole time which is v annoying
      return !!error && count < 6;
    },
  });

  // HTTP Link for queries and mutations including file uploads
  const httpLink = retryLink.concat(
    createUploadLink({
      uri: API_URI,
      credentials: 'include',
      headers,
    })
  );

  // Switch between the two links based on operation
  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink
  );

  return new ApolloClient({
    link,
    // eslint-disable-next-line
    cache: window.__DATA__ ? cache.restore(window.__DATA__) : cache,
    ssrForceFetchDelay: 100,
    queryDeduplication: true,
  });
};

const client = createClient();

export { client };

export const clearApolloStore = () => {
  try {
    client.resetStore();
  } catch (e) {
    console.error('error clearing store');
  }
};
