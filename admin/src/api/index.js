// @flow
// $FlowFixMe
import { ApolloClient, createNetworkInterface } from 'react-apollo';

const IS_PROD = process.env.NODE_ENV === 'production';

// In production the API is at the same URL, in development it's at a different port
const API_URI = IS_PROD ? '/api' : 'http://localhost:3001/api';
const networkInterface = createNetworkInterface({
  uri: API_URI,
  opts: {
    credentials: 'include',
  },
});

export const client = new ApolloClient({
  networkInterface,
});

export const SERVER_URL = IS_PROD
  ? `${window.location.protocol}//${window.location.host}`
  : 'http://localhost:3001';

export const PUBLIC_STRIPE_KEY = IS_PROD
  ? 'pk_live_8piI030RqVnqDc8QGTUwUj0Z'
  : 'pk_test_A6pKi4xXOdgg9FrZJ84NW9mP';
