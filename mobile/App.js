// @flow
import React from 'react';
import { ApolloProvider } from 'react-apollo';

import client from './gql';
import TabBar from './views/TabBar';

const App = () => (
  <ApolloProvider client={client}>
    <TabBar />
  </ApolloProvider>
);

export default App;
