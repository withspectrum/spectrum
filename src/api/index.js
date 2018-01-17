// @flow
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import introspectionQueryResultData from './schema.json';
import getSharedApolloClientOptions from 'shared/graphql/apollo-client-options';

// import { createBatchingNetworkInterface } from 'apollo-upload-client';
// import {
//   SubscriptionClient,
//   addGraphQLSubscriptions,
// } from 'subscriptions-transport-ws';

const IS_PROD = process.env.NODE_ENV === 'production';
// In production the API is at the same URL, in development it's at a different port
const API_URI = IS_PROD ? '/api' : 'http://localhost:3001/api';
const cache = new InMemoryCache({
  fragmentMatcher: new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
  }),
  ...getSharedApolloClientOptions(),
});

const client = new ApolloClient({
  link: createHttpLink({
    uri: API_URI,
    credentials: 'include',
  }),
  cache: window.__SERVER_STATE__
    ? cache.restore(window.__SERVER_STATE__.apollo)
    : cache,
  ssrForceFetchDelay: 100,
  queryDeduplication: true,
});

export { client };

// const networkInterface = createBatchingNetworkInterface({
//   uri: API_URI,
//   batchInterval: 10,
//   opts: {
//     credentials: 'include',
//   },
// });
// const wsClient = new SubscriptionClient(
//   `${IS_PROD
//     ? `wss://${window.location.host}`
//     : 'ws://localhost:3001'}/websocket`,
//   { reconnect: true }
// );

// const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
//   networkInterface,
//   wsClient
// );

// const
// export const client = new ApolloClient({
//   networkInterface: networkInterfaceWithSubscriptions,
//   fragmentMatcher,
//   initialState: window.__SERVER_STATE__ && {
//     apollo: window.__SERVER_STATE__.apollo,
//   },
//   ssrForceFetchDelay: 100,
//   ...getSharedApolloClientOptions(),
// });

export const clearApolloStore = () => {
  try {
    client.resetStore();
  } catch (e) {
    console.log('error clearing store');
  }
};
