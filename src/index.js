// @flow
import React from 'react';
import ReactDOM from 'react-dom';
//$FlowFixMe
import { ThemeProvider } from 'styled-components';
//$FlowFixMe
import { ApolloProvider } from 'react-apollo';
import queryString from 'query-string';
import { Router } from 'react-router';
import { history } from './helpers/history';
import { client } from './api';
import { initStore } from './store';
import { getItemFromStorage } from './helpers/localStorage';
import { theme } from './components/theme';
import Routes from './routes';
import Homepage from './views/homepage';
import { addToastWithTimeout } from './actions/toasts';
import registerServiceWorker from './registerServiceWorker';
import type { ServiceWorkerResult } from './registerServiceWorker';
import { track } from './helpers/events';

const { thread } = queryString.parse(history.location.search);
if (thread) {
  const hash = window.location.hash.substr(1);
  if (hash && hash.length > 1) {
    history.replace(`/thread/${thread}#${hash}`);
  } else {
    history.replace(`/thread/${thread}`);
  }
}

const existingUser = getItemFromStorage('spectrum');
let store;
if (existingUser) {
  store = initStore(
    {
      users: {
        currentUser: existingUser.currentUser,
      },
    },
    {
      middleware: [client.middleware()],
      reducers: {
        apollo: client.reducer(),
      },
    }
  );
} else {
  store = initStore(
    {},
    {
      middleware: [client.middleware()],
      reducers: {
        apollo: client.reducer(),
      },
    }
  );
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
      <Router history={history}>
        <ThemeProvider theme={theme}>
          <Homepage />
        </ThemeProvider>
      </Router>,
      document.querySelector('#root')
    );
  } else {
    return ReactDOM.render(
      <Router history={history}>
        <ApolloProvider store={store} client={client}>
          <ThemeProvider theme={theme}>
            <Routes />
          </ThemeProvider>
        </ApolloProvider>
      </Router>,
      document.querySelector('#root')
    );
  }
}

try {
  render();
} catch (err) {
  render();
}

registerServiceWorker().then(({ newContent }: ServiceWorkerResult) => {
  if (newContent) {
    store.dispatch(
      addToastWithTimeout(
        'success',
        'A new version of Spectrum is available, refresh the page to see it! 🚀'
      )
    );
  }
  // We don't show a message on first cache, simply because the API isn't cached offline
  // so the app isn't offline usable, it's just cached so the first pageload is much faster
});

// This fires when a user is prompted to add the app to their homescreen
// We use it to track it happening in Google Analytics so we have those sweet metrics
window.addEventListener('beforeinstallprompt', e => {
  track('user', 'prompted to add to homescreen');
  e.userChoice.then(choiceResult => {
    if (choiceResult.outcome === 'dismissed') {
      track('user', 'did not add to homescreen');
    } else {
      track('user', 'added to homescreen');
    }
  });
});
