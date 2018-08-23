// @flow
// This needs to be imported before everything else
import './helpers/consolidate-streamed-styles';
import 'css.escape';
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import queryString from 'query-string';
import Loadable from 'react-loadable';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import { HelmetProvider } from 'react-helmet-async';
import webPushManager from './helpers/web-push-manager';
import { history } from './helpers/history';
import { client } from 'shared/graphql';
import { initStore } from './store';
import { getItemFromStorage } from './helpers/localStorage';
import Routes from './hot-routes';
import { track, events } from './helpers/analytics';
import { wsLink } from 'shared/graphql';
import { subscribeToDesktopPush } from './subscribe-to-desktop-push';
import ViewError from 'src/components/viewError';
import { Button } from 'src/components/buttons';
import { ThemeProvider } from 'styled-components';
import { theme } from 'shared/theme';

const storedData: ?Object = getItemFromStorage('spectrum');
const params = queryString.parse(history.location.search);

// Always redirect ?thread=asdfxyz to the thread view
if (params.thread) {
  if (params.m) {
    history.replace(`/thread/${params.thread}?m=${params.m}`);
  } else {
    history.replace(`/thread/${params.thread}`);
  }
}

// Redirect ?t=asdfxyz to the thread view only for anonymous users who wouldn't see it
// in their inbox view (since they don't have an inbox view)
if ((!storedData || !storedData.currentUser) && params.t)
  history.replace(`/thread/${params.t}`);

// If the server passes an initial redux state use that, otherwise construct our own
const store = initStore(
  window.__SERVER_STATE__ || {
    users: {
      currentUser: storedData ? storedData.currentUser : null,
    },
    dashboardFeed: {
      activeThread: params.t || '',
      mountedWithActiveThread: params.t || '',
      search: {
        isOpen: false,
      },
    },
  }
);

const App = () => {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <ApolloProvider client={client}>
          <ThemeProvider theme={theme}>
            <ViewError
              emoji={'🛠'}
              heading={'Down for maintenance'}
              subheading={
                'We’re working on improving the stability of Spectrum. We’ll be back soon!'
              }
            >
              <a
                href="https://twitter.com/withspectrum"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button icon={'twitter'} large>
                  Get Updates on Twitter
                </Button>
              </a>
            </ViewError>
          </ThemeProvider>
          {/*
            <Router history={history}>
              <Routes currentUser={storedData ? storedData.currentUser : null} />
            </Router>
          */}
        </ApolloProvider>
      </HelmetProvider>
    </Provider>
  );
};

const renderMethod = !!window.__SERVER_STATE__
  ? // $FlowIssue
    ReactDOM.hydrate
  : ReactDOM.render;

function render() {
  return renderMethod(
    <App />,
    // $FlowIssue
    document.querySelector('#root')
  );
}

Loadable.preloadReady()
  .then(render)
  .catch(err => {
    console.error(err);
  });

OfflinePluginRuntime.install({
  // Apply new updates immediately
  onUpdateReady: () => OfflinePluginRuntime.applyUpdate(),
  // Set a global variable when an update was installed so that we can reload the page when users
  // go to a new page, leading to no interruption in the workflow.
  // Idea from https://zach.codes/handling-client-side-app-updates-with-service-workers/
  onUpdated: () => (window.appUpdateAvailable = true),
});

if ('serviceWorker' in navigator && 'PushManager' in window) {
  // $FlowIssue
  navigator.serviceWorker.ready.then(registration => {
    webPushManager.set(registration.pushManager);
  });
}

wsLink.subscriptionClient.on('disconnected', () =>
  store.dispatch({ type: 'WEBSOCKET_CONNECTION', value: 'disconnected' })
);
wsLink.subscriptionClient.on('connected', () =>
  store.dispatch({ type: 'WEBSOCKET_CONNECTION', value: 'connected' })
);
wsLink.subscriptionClient.on('reconnected', () =>
  store.dispatch({ type: 'WEBSOCKET_CONNECTION', value: 'reconnected' })
);

// This fires when a user is prompted to add the app to their homescreen
// We use it to track it happening in Google Analytics so we have those sweet metrics
window.addEventListener('beforeinstallprompt', e => {
  track(events.PWA_HOME_SCREEN_PROMPTED);
  e.userChoice.then(choiceResult => {
    if (choiceResult.outcome === 'dismissed') {
      track(events.PWA_HOME_SCREEN_DISMISSED);
    } else {
      track(events.PWA_HOME_SCREEN_ADDED);
    }
  });
});

subscribeToDesktopPush(data => {
  if (data && data.href) history.push(data.href);
});
