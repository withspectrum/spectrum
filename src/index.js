import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { Router } from 'react-router';
import queryString from 'query-string';
import Loadable from 'react-loadable';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import webPushManager from './helpers/web-push-manager';
import { history } from './helpers/history';
import { client } from './api';
import { initStore } from './store';
import { getItemFromStorage } from './helpers/localStorage';
import Routes from './routes';
import { track } from './helpers/events';

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

const store = initStore(window.__SERVER_STATE__ || initialState, {
  middleware: [client.middleware()],
  reducers: {
    apollo: client.reducer(),
  },
});

function render() {
  return ReactDOM.render(
    <ApolloProvider store={store} client={client}>
      <Router history={history}>
        <Routes
          maintenanceMode={process.env.REACT_APP_MAINTENANCE_MODE === 'enabled'}
        />
      </Router>
    </ApolloProvider>,
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
  navigator.serviceWorker.ready.then(registration => {
    webPushManager.set(registration.pushManager);
  });
}

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
