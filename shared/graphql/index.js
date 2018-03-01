// @flow
import { ApolloClient } from 'apollo-client';
import { createUploadLink } from 'apollo-upload-client';
import { RetryLink } from 'apollo-link-retry';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import QueueLink from 'apollo-link-queue';
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
      initial: 1000,
    },
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

  const queueLink = new QueueLink();

  const onOnline = () => queueLink.open();
  const onOffline = () => queueLink.close();

  const uploadLink = createUploadLink({
    uri: API_URI,
    credentials: 'include',
    headers,
  });

  const httpLink = ApolloLink.from([retryLink, queueLink, uploadLink]);

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

  const client = new ApolloClient({
    link,
    // eslint-disable-next-line
    cache: window.__DATA__ ? cache.restore(window.__DATA__) : cache,
    ssrForceFetchDelay: 100,
    queryDeduplication: true,
  });

  return { client, onOnline, onOffline };
};

const { client, onOnline, onOffline } = createClient();

export { client, onOnline, onOffline };

export const clearApolloStore = () => {
  try {
    client.resetStore();
  } catch (e) {
    console.log('error clearing store');
  }
};
