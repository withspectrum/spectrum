// @flow
import React from 'react';
import ReactDOM from 'react-dom';
// $FlowFixMe
import { ApolloProvider } from 'react-apollo';
// $FlowFixMe
import { ThemeProvider } from 'styled-components';
import { theme } from './components/theme';
import { client } from './api';
import { initStore } from './store';
import Routes from './routes';

let store = initStore({});

ReactDOM.render(
  <ApolloProvider store={store} client={client}>
    <ThemeProvider theme={theme}>
      <Routes />
    </ThemeProvider>
  </ApolloProvider>,
  document.getElementById('root')
);
