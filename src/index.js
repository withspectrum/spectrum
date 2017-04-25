// @flow
import React from 'react';
import ReactDOM from 'react-dom';
//$FlowFixMe
import { ThemeProvider } from 'styled-components';
//$FlowFixMe
import { ApolloProvider } from 'react-apollo';
import { client } from './api';
import { initStore } from './store';
import {
  clearStorage,
  getItemFromStorage,
  storeItem,
} from './helpers/localStorage';
import { theme } from './components/theme';
import Routes from './routes';
import Homepage from './views/homepage';

const MATCH_UID = /\?user=(.+)/g;
if (window.location.search && MATCH_UID.test(window.location.search)) {
  const uid = MATCH_UID.exec(window.location.search)[1];
  if (uid) {
    storeItem('spectrum', { uid });
    window.location.search = '';
  }
}
const existingUser = getItemFromStorage('spectrum');
const store = initStore({
  users: {
    currentUser: existingUser,
  },
});

function render() {
  // if user is not stored in localStorage and they visit a blacklist url
  if (
    !existingUser &&
    (window.location.pathname === '/' ||
      window.location.pathname === '/messages' ||
      window.location.pathname === '/notifications')
  ) {
    return ReactDOM.render(
      <ThemeProvider theme={theme}>
        <Homepage />
      </ThemeProvider>,
      document.querySelector('#root')
    );
  }

  // otherwise load the app and we'll handle logged-out and logged-in users
  // further down the tree
  return ReactDOM.render(
    <ApolloProvider store={store} client={client}>
      <ThemeProvider theme={theme}>
        <Routes />
      </ThemeProvider>
    </ApolloProvider>,
    document.querySelector('#root')
  );
}

try {
  render();
} catch (err) {
  clearStorage();
  render();
}
