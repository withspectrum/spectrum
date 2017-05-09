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
const wsClient = new SubscriptionClient('ws://localhost:5000');

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:3001/',
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
