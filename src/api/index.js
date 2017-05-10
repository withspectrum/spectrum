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

const networkInterface = createNetworkInterface({
  uri: '/api',
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
