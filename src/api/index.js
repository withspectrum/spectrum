// @flow
import { ApolloClient, createNetworkInterface } from 'react-apollo';

const networkInterface = createNetworkInterface({
  opts: {
    credentials: 'include',
  },
  uri: 'http://localhost:3001/',
});

export const client = new ApolloClient({
  networkInterface,
});

export const clearApolloStore = () => {
  try {
    client.resetStore();
  } catch (e) {
    console.log('error clearing store');
  }
};
