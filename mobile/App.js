// @flow
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import client from './gql';
import Splash from './views/splash';

const App = () => (
  <ApolloProvider client={client}>
    <Splash id={'ce2b4488-4c75-47e0-8ebc-2539c1e6a191'} />
  </ApolloProvider>
);

export default App;
