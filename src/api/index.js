// @flow
import { ApolloClient, createNetworkInterface } from 'react-apollo';
import {
  SubscriptionClient,
  addGraphQLSubscriptions,
} from 'subscriptions-transport-ws';

// TODO Fix for production
const wsClient = new SubscriptionClient('ws://localhost:5000');

const networkInterface = createNetworkInterface({
  opts: {
    credentials: 'include',
  },
  uri: 'http://localhost:3001/',
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
