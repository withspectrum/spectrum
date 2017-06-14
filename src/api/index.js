// @flow
// $FlowFixMe
import { ApolloClient, IntrospectionFragmentMatcher } from 'react-apollo';
// $FlowFixMe
import { createNetworkInterface } from 'apollo-upload-client-fork-mxstbr';
// $FlowFixMe
import {
  SubscriptionClient,
  addGraphQLSubscriptions,
} from 'subscriptions-transport-ws';
import introspectionQueryResultData from './schema.json';

const IS_PROD = process.env.NODE_ENV === 'production';
const wsClient = new SubscriptionClient(
  `${IS_PROD ? `wss://${window.location.host}` : 'ws://localhost:3001'}/websocket`,
  { reconnect: true }
);

// In production the API is at the same URL, in development it's at a different port
const API_URI = IS_PROD ? '/api' : 'http://localhost:3001/api';
const networkInterface = createNetworkInterface({
  uri: API_URI,
  opts: {
    credentials: 'include',
  },
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

export const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  fragmentMatcher,
});

export const clearApolloStore = () => {
  try {
    client.resetStore();
  } catch (e) {
    console.log('error clearing store');
  }
};

export const SERVER_URL = process.env.NODE_ENV === 'production'
  ? `${window.location.protocol}//${window.location.host}`
  : 'http://localhost:3001';

export const PUBLIC_STRIPE_KEY = process.env.NODE_ENV === 'production'
  ? 'pk_live_8piI030RqVnqDc8QGTUwUj0Z'
  : 'pk_test_A6pKi4xXOdgg9FrZJ84NW9mP';
