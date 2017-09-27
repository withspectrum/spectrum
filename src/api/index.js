// $FlowFixMe
import { ApolloClient, IntrospectionFragmentMatcher } from 'react-apollo';
// $FlowFixMe
import { createBatchingNetworkInterface } from 'apollo-upload-client';
// $FlowFixMe
import {
  SubscriptionClient,
  addGraphQLSubscriptions,
} from 'subscriptions-transport-ws';
import introspectionQueryResultData from './schema.json';
import getSharedApolloClientOptions from 'shared/graphql/apollo-client-options';

const IS_PROD = process.env.NODE_ENV === 'production';
const wsClient = new SubscriptionClient(
  `${IS_PROD
    ? `wss://${window.location.host}`
    : 'ws://localhost:3001'}/websocket`,
  { reconnect: true }
);

// In production the API is at the same URL, in development it's at a different port
const API_URI = IS_PROD ? '/api' : 'http://localhost:3001/api';
const networkInterface = createBatchingNetworkInterface({
  uri: API_URI,
  batchInterval: 10,
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
  initialState: window.__SERVER_STATE__ && {
    apollo: window.__SERVER_STATE__.apollo,
  },
  ssrForceFetchDelay: 100,
  ...getSharedApolloClientOptions(),
});

export const clearApolloStore = () => {
  try {
    client.resetStore();
  } catch (e) {
    console.log('error clearing store');
  }
};
