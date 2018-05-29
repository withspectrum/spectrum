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
import Routes from './routes';
import { track, events } from './helpers/analytics';
import { wsLink } from 'shared/graphql';
import { subscribeToDesktopPush } from './subscribe-to-desktop-push';

const { thread, t } = queryString.parse(history.location.search);

const existingUser = getItemFromStorage('spectrum');
let initialState;
if (existingUser) {
  initialState = {
    users: {
      currentUser: existingUser.currentUser,
    },
    dashboardFeed: {
      activeThread: t ? t : '',
      mountedWithActiveThread: t ? t : '',
      search: {
        isOpen: false,
      },
    },
  };
} else {
  initialState = {};
}

if (thread) {
  const hash = window.location.hash.substr(1);
  if (hash && hash.length > 1) {
    history.replace(`/thread/${thread}#${hash}`);
  } else {
    history.replace(`/thread/${thread}`);
  }
}
if (t && (!existingUser || !existingUser.currentUser)) {
  const hash = window.location.hash.substr(1);
  if (hash && hash.length > 1) {
    history.replace(`/thread/${t}#${hash}`);
  } else {
    history.replace(`/thread/${t}`);
  }
}

const store = initStore(window.__SERVER_STATE__ || initialState);

// eslint-disable-next-line
const renderMethod = !!window.__SERVER_STATE__
  ? // $FlowIssue
    ReactDOM.hydrate
  : ReactDOM.render;

function render() {
  return renderMethod(
    <Provider store={store}>
      <HelmetProvider>
        <ApolloProvider client={client}>
          <Router history={history}>
            <Routes />
          </Router>
        </ApolloProvider>
      </HelmetProvider>
    </Provider>,
    // $FlowIssue
    document.querySelector('#root')
  );
}

Loadable.preloadReady().then(render);

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
