// @flow
// $FlowFixMe
import { ApolloClient } from 'react-apollo';
// $FlowFixMe
import { createNetworkInterface } from 'apollo-upload-client';
// $FlowFixMe
import {
  SubscriptionClient,
  addGraphQLSubscriptions,
} from 'subscriptions-transport-ws';

// TODO Fix for production
const wsClient = new SubscriptionClient(`wss://${window.location.host}`);

// In production the API is at the same URL, in development it's at a different port
const API_URI = process.env.NODE_ENV === 'production'
  ? '/api'
  : 'http://localhost:3001/api';
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

export const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
});

export const clearApolloStore = () => {
  try {
    client.resetStore();
  } catch (e) {
    console.log('error clearing store');
  }
};
