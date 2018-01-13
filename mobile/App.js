// @flow
import React from 'react';
import { ApolloProvider } from 'react-apollo';

import client from './gql';
import Thread from './views/Thread';

const App = () => (
  <ApolloProvider client={client}>
    <Thread id={'ce2b4488-4c75-47e0-8ebc-2539c1e6a193'} />
  </ApolloProvider>
);

export default App;
