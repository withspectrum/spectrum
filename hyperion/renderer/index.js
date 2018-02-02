// @flow
// Server-side renderer for our React code
import fs from 'fs';
const debug = require('debug')('hyperion:renderer');
import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { StaticRouter } from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import * as graphql from 'graphql';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import Raven from 'shared/raven';
import introspectionQueryResultData from 'shared/graphql/schema.json';
// $FlowIssue
import stats from '../../build/react-loadable.json';

import getSharedApolloClientOptions from 'shared/graphql/apollo-client-options';
import { getFooter, getHeader, createScriptTag } from './html-template';

// Browser shim has to come before any client imports
import './browser-shim';
const Routes = require('../../src/routes').default;
import { initStore } from '../../src/store';

const IN_MAINTENANCE_MODE =
  process.env.REACT_APP_MAINTENANCE_MODE === 'enabled';
const IS_PROD = process.env.NODE_ENV === 'production';
const FORCE_DEV = process.env.FORCE_DEV;

if (!IS_PROD || FORCE_DEV) console.log('Querying API at localhost:3001/api');

const renderer = (req: express$Request, res: express$Response) => {
  debug(`server-side render ${req.url}`);
  debug(`querying API at https://${req.hostname}/api`);
  // HTTP Link for queries and mutations including file uploads
  const httpLink = createHttpLink({
    uri:
      IS_PROD && !FORCE_DEV
        ? `https://${req.hostname}/api`
        : 'http://localhost:3001/api',
    credentials: 'include',
    headers: {
      cookie: req.headers.cookie,
    },
  });

  const cache = new InMemoryCache({
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData,
    }),
    ...getSharedApolloClientOptions(),
  });

  // Create an Apollo Client with a local network interface
  const client = new ApolloClient({
    ssrMode: true,
    link: httpLink,
    cache,
  });
  // Define the initial redux state
  const initialReduxState = {
    users: {
      currentUser: req.user ? req.user : null,
    },
  };
  // Create the Redux store
  const store = initStore(initialReduxState);
  let modules = [];
  const report = moduleName => {
    modules.push(moduleName);
  };
  let routerContext = {};
  let helmetContext = {};
  // Initialise the styled-components stylesheet and wrap the app with it
  const sheet = new ServerStyleSheet();
  const frontend = sheet.collectStyles(
    <Loadable.Capture report={report}>
      <ApolloProvider client={client}>
        <HelmetProvider context={helmetContext}>
          <Provider store={store}>
            <StaticRouter location={req.url} context={routerContext}>
              <Routes maintenanceMode={IN_MAINTENANCE_MODE} />
            </StaticRouter>
          </Provider>
        </HelmetProvider>
      </ApolloProvider>
    </Loadable.Capture>
  );

  debug('get data from tree');
  getDataFromTree(frontend)
    .then(() => {
      debug('got data from tree');
      if (routerContext.url) {
        debug('found redirect on frontend, redirecting');
        // Somewhere a `<Redirect>` was rendered, so let's redirect server-side
        res.redirect(301, routerContext.url);
        return;
      }
      // maintainance mode
      if (IN_MAINTENANCE_MODE) {
        debug('maintainance mode enabled, sending 503');
        res.status(503);
        res.set('Retry-After', '3600');
      } else {
        res.status(200);
      }
      const state = store.getState();
      const data = client.extract();
      const { helmet } = helmetContext;
      debug('write header');
      res.write(
        getHeader({
          metaTags:
            helmet.title.toString() +
            helmet.meta.toString() +
            helmet.link.toString(),
        })
      );
      const bundles = getBundles(stats, modules)
        // Create <script defer> tags from bundle objects
        .map(bundle => `/${bundle.file.replace(/\.map$/, '')}`)
        // Make sure only unique bundles are included
        .filter((value, index, self) => self.indexOf(value) === index);
      debug('bundles used:', bundles.join(','));

      const stream = sheet.interleaveWithNodeStream(
        renderToNodeStream(frontend)
      );

      stream.pipe(res, { end: false });

      stream.on('end', () =>
        res.end(
          getFooter({
            state,
            data,
            bundles,
          })
        )
      );
    })
    .catch(err => {
      console.error(err);
      const sentryId =
        process.env.NODE_ENV === 'production'
          ? Raven.captureException(err)
          : 'Only output in production.';
      res.status(500);
      res.send(
        `Oops, something went wrong. Please try again! (Error ID: ${sentryId})`
      );
    });
};

export default renderer;
