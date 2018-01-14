// @flow
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ThemeProvider } from 'styled-components';
import theme from './components/theme';

import client from './gql';
import TabBar from './views/TabBar';

const App = () => (
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <TabBar />
    </ThemeProvider>
  </ApolloProvider>
);

export default App;
