// @flow
import { ApolloClient } from 'apollo-client';
import { createUploadLink } from 'apollo-upload-client';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import introspectionQueryResultData from './schema.json';
import getSharedApolloClientOptions from './apollo-options';

const IS_PROD = process.env.NODE_ENV === 'production';
// In production the API is at the same URL, in development it's at a different port
const API_URI = IS_PROD
  ? 'https://spectrum.chat/api'
  : 'http://localhost:3001/api';

const cache = new InMemoryCache({
  fragmentMatcher: new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
  }),
  ...getSharedApolloClientOptions(),
});

// HTTP Link for queries and mutations including file uploads
const httpLink = createUploadLink({
  uri: API_URI,
  credentials: 'include',
});

// Websocket link for subscriptions
const wsLink = new WebSocketLink({
  uri: `${
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
  cache: window.__DATA__ ? cache.restore(window.__DATA__) : cache,
  ssrForceFetchDelay: 100,
  queryDeduplication: true,
});

export { client };

export const clearApolloStore = () => {
  try {
    client.resetStore();
  } catch (e) {
    console.error('error clearing store');
  }
};
