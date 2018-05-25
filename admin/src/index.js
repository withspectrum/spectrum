// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { ApolloProvider } from 'react-apollo';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { theme } from 'shared/theme';
import { client } from './api';
import { initStore } from './store';
import Routes from './routes';
import { history } from './helpers/history';

let initialState;
const store = initStore(window.__SERVER_STATE__ || initialState);

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Router history={history}>
          <Routes />
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  </Provider>,
  // $FlowIssue
  document.getElementById('root')
);
