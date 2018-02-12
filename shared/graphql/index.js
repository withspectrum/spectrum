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

const IS_PROD = process.env.NODE_ENV === 'production';
// In production the API is at the same URL, in development it's at a different port
const API_URI = IS_PROD ? '/api' : 'http://localhost:3001/api';

type CreateClientOptions = {
  token?: ?string,
};

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
    delay: {
      initial: 500,
    },
    attempts: {
      max: 20,
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

  // Websocket link for subscriptions
  const wsLink = new WebSocketLink({
    uri: `${
      // eslint-disable-next-line
      IS_PROD ? `wss://${window.location.host}` : 'ws://localhost:3001'
    }/websocket`,
    options: {
      reconnect: true,
    },
  });

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
    console.log('error clearing store');
  }
};
