// @flow
import React from 'react';
import ReactDOM from 'react-dom';
//$FlowFixMe
import { ThemeProvider } from 'styled-components';
//$FlowFixMe
import { ApolloProvider } from 'react-apollo';
import { client } from './api';
import { initStore } from './store';
import { getItemFromStorage } from './helpers/localStorage';
import { theme } from './components/theme';
import Routes from './routes';
import Homepage from './views/homepage';

const existingUser = getItemFromStorage('spectrum');
let store;
if (existingUser) {
  store = initStore({
    users: {
      currentUser: existingUser.currentUser,
    },
  });
} else {
  store = initStore({});
}

function render() {
  // if user is not stored in localStorage and they visit a blacklist url
  if (
    (!existingUser || existingUser === null) &&
    (window.location.pathname === '/' ||
      window.location.pathname === '/messages' ||
      window.location.pathname === '/messages/new' ||
      window.location.pathname === '/notifications')
  ) {
    return ReactDOM.render(
      <ThemeProvider theme={theme}>
        <Homepage />
      </ThemeProvider>,
      document.querySelector('#root')
    );
  } else {
    // otherwise load the app and we'll handle logged-out and logged-in users
    // further down the tree
    console.log(existingUser);
    return ReactDOM.render(
      <ApolloProvider store={store} client={client}>
        <ThemeProvider theme={theme}>
          <Routes />
        </ThemeProvider>
      </ApolloProvider>,
      document.querySelector('#root')
    );
  }
}

try {
  render();
} catch (err) {
  render();
}
