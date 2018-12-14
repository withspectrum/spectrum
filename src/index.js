// @flow
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
import webPushManager from 'src/helpers/web-push-manager';
import { history } from 'src/helpers/history';
import { client } from 'shared/graphql';
import { initStore } from 'src/store';
import { track, events } from 'src/helpers/analytics';
import { wsLink } from 'shared/graphql';
import { subscribeToDesktopPush } from 'src/subscribe-to-desktop-push';
import RedirectHandler from 'src/components/redirectHandler';
const params = queryString.parse(history.location.search);

// Always redirect ?thread=asdfxyz to the thread view
if (params.thread) {
  if (params.m) {
    history.replace(`/thread/${params.thread}?m=${params.m}`);
  } else {
    history.replace(`/thread/${params.thread}`);
  }
}
// If the server passes an initial redux state use that, otherwise construct our own
const store = initStore(
  window.__SERVER_STATE__ || {
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
          <Router history={history}>
            <RedirectHandler
              maintenanceMode={
                process.env.REACT_APP_MAINTENANCE_MODE === 'enabled'
              }
            />
          </Router>
        </ApolloProvider>
      </HelmetProvider>
    </Provider>
  );
};

const renderMethod = window.__SERVER_STATE__
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
