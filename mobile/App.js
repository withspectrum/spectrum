// @flow
import React from 'react';
import { ApolloProvider } from 'react-apollo';

import client from './gql';
import Routes from './routes';

const App = () => (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

export default App;
