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
import { wsLink } from 'shared/graphql';
import { subscribeToDesktopPush } from 'src/subscribe-to-desktop-push';
import RedirectHandler from 'src/components/redirectHandler';
const params = queryString.parse(history.location.search);

// Redirect legacy ?thread=asdf & ?t=asdf URLs to the proper /<community>/<channel>/<thread>
// equivalents via the /thread/<id> shorthand
const threadParam = params.thread || params.t;
if (threadParam) {
  if (params.m) {
    history.replace(`/thread/${threadParam}?m=${params.m}`);
  } else {
    history.replace(`/thread/${threadParam}`);
  }
}
// If the server passes an initial redux state use that, otherwise construct our own
const store = initStore(window.__SERVER_STATE__ || {});

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

subscribeToDesktopPush(data => {
  if (data && data.href) history.push(data.href);
});
