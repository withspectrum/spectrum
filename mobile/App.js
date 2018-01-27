// @flow
import Sentry from 'sentry-expo';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ThemeProvider } from 'styled-components';

import theme from './components/theme';
import { client } from '../shared/graphql';
import TabBar from './views/TabBar';

Sentry.config(
  'https://3bd8523edd5d43d7998f9b85562d6924@sentry.io/154812'
).install();

const App = () => (
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <TabBar />
    </ThemeProvider>
  </ApolloProvider>
);

export default App;
