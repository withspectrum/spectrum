// @flow
// $FlowFixMe
import {
  ApolloClient,
  IntrospectionFragmentMatcher,
  toIdValue,
} from 'react-apollo';
// $FlowFixMe
import { createBatchingNetworkInterface } from 'apollo-upload-client';
// $FlowFixMe
import {
  SubscriptionClient,
  addGraphQLSubscriptions,
} from 'subscriptions-transport-ws';
import introspectionQueryResultData from './schema.json';

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
  initialState: window.__APOLLO_STATE__,
  queryDeduplication: true,
  dataIdFromObject: result => {
    if (result.__typename) {
      // Custom Community cache key based on slug
      if (result.__typename === 'Community' && !!result.slug) {
        return `${result.__typename}:${result.slug}`;
      }
      // Custom Channel cache key based on slug and community slug
      if (
        result.__typename === 'Channel' &&
        !!result.slug &&
        !!result.community &&
        !!result.community.slug
      ) {
        return `${result.__typename}:${result.community.slug}:${result.slug}`;
      }
      // This was copied from the default dataIdFromObject
      if (result.id !== undefined) {
        return `${result.__typename}:${result.id}`;
      }
      if (result._id !== undefined) {
        return `${result.__typename}:${result._id}`;
      }
    }
    return null;
  },
  customResolvers: {
    Query: {
      thread: (_, { id }) =>
        toIdValue(client.dataIdFromObject({ __typename: 'Thread', id })),
      community: (_, { slug }) =>
        toIdValue(client.dataIdFromObject({ __typename: 'Community', slug })),
      channel: (_, { channelSlug, communitySlug }) =>
        toIdValue(
          client.dataIdFromObject({
            __typename: 'Channel',
            slug: channelSlug,
            community: { slug: communitySlug },
          })
        ),
    },
  },
});

export const clearApolloStore = () => {
  try {
    client.resetStore();
  } catch (e) {
    console.log('error clearing store');
  }
};
