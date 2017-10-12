// Server-side renderer for our React code
import fs from 'fs';
const debug = require('debug')('iris:renderer');
import React from 'react';
import ReactDOM from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import {
  ApolloClient,
  createNetworkInterface,
  ApolloProvider,
  renderToStringWithData,
} from 'react-apollo';
import { StaticRouter } from 'react-router';
import { createStore } from 'redux';
import { createLocalInterface } from 'apollo-local-query';
import Helmet from 'react-helmet';
import * as graphql from 'graphql';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import stats from '../../build/react-loadable.json';

import getSharedApolloClientOptions from 'shared/graphql/apollo-client-options';
import schema from '../schema';
import createLoaders from '../loaders';
import { getHTML } from './get-html';

// Browser shim has to come before any client imports
import './browser-shim';
const Routes = require('../../src/routes').default;
import { initStore } from '../../src/store';

const IN_MAINTENANCE_MODE =
  process.env.REACT_APP_MAINTENANCE_MODE === 'enabled';

const renderer = (req, res) => {
  debug(`server-side render ${req.url}`);
  // Create an Apollo Client with a local network interface
  const client = new ApolloClient({
    ssrMode: true,
    networkInterface: createLocalInterface(graphql, schema, {
      context: {
        loaders: createLoaders(),
        user: req.user,
      },
    }),
    ...getSharedApolloClientOptions(),
  });
  // Define the initial redux state
  const initialReduxState = {
    users: {
      currentUser: req.user,
    },
  };
  // Create the Redux store
  const store = initStore(initialReduxState, {
    // Inject the server-side client's middleware and reducer
    middleware: [client.middleware()],
    reducers: {
      apollo: client.reducer(),
    },
  });
  let modules = [];
  const report = moduleName => {
    debug(`codesplitted module ${moduleName} used`);
    modules.push(moduleName);
  };
  const context = {};
  // The client-side app will instead use <BrowserRouter>
  const frontend = (
    <Loadable.Capture report={report}>
      <ApolloProvider store={store} client={client}>
        <StaticRouter location={req.url} context={context}>
          <Routes maintenanceMode={IN_MAINTENANCE_MODE} />
        </StaticRouter>
      </ApolloProvider>
    </Loadable.Capture>
  );
  // Initialise the styled-components stylesheet and wrap the app with it
  const sheet = new ServerStyleSheet();
  debug(`render frontend`);
  renderToStringWithData(sheet.collectStyles(frontend))
    .then(content => {
      if (context.url) {
        debug('found redirect on frontend, redirecting');
        // Somewhere a `<Redirect>` was rendered, so let's redirect server-side
        res.redirect(301, context.url);
        return;
      }
      // Get the resulting data
      const state = store.getState();
      const helmet = Helmet.renderStatic();
      if (IN_MAINTENANCE_MODE) {
        debug('maintainance mode enabled, sending 503');
        res.status(503);
        res.set('Retry-After', 3600);
      } else {
        res.status(200);
      }
      const bundles = getBundles(stats, modules);
      debug('compile and send html');
      // Compile the HTML and send it down
      res.send(
        getHTML({
          content,
          state,
          styleTags: sheet.getStyleTags(),
          metaTags:
            helmet.title.toString() +
            helmet.meta.toString() +
            helmet.link.toString(),
          scriptTags: [
            '<script src="/static/js/bootstrap.js"></script>',
            ...bundles
              .map(
                bundle =>
                  `<script src="/${bundle.file.replace(
                    /\.map$/,
                    ''
                  )}"></script>`
              )
              .filter((value, index, self) => self.indexOf(value) === index),
          ].join('\n'),
        })
      );
      res.end();
    })
    .catch(err => {
      console.log(err);
      res.status(500);
      res.end();
      throw err;
    });
};

export default renderer;
