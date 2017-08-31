// @flow
// Server-side renderer for our React code
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

import schema from '../schema';
import createLoaders from '../loaders';
import { getHTML } from './get-html';

// Browser shim has to come before any client imports
import './browser-shim';
const Routes = require('../../src/routes').default;
import { initStore } from '../../src/store';

const renderer = (req, res) => {
  // Create an Apollo Client with a local network interface
  const client = new ApolloClient({
    ssrMode: true,
    networkInterface: createLocalInterface(graphql, schema, {
      context: {
        loaders: createLoaders(),
        user: req.user,
      },
    }),
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
  const context = {};
  // The client-side app will instead use <BrowserRouter>
  const frontend = (
    <ApolloProvider store={store} client={client}>
      <StaticRouter location={req.url} context={context}>
        <Routes />
      </StaticRouter>
    </ApolloProvider>
  );
  // Initialise the styled-components stylesheet and wrap the app with it
  const sheet = new ServerStyleSheet();
  renderToStringWithData(sheet.collectStyles(frontend))
    .then(content => {
      if (context.url) {
        // Somewhere a `<Redirect>` was rendered, so let's redirect server-side
        res.redirect(301, context.url);
        return;
      }
      // Get the resulting data
      const state = store.getState();
      const helmet = Helmet.renderStatic();
      // Compile the HTML and send it down
      res.status(200);
      res.send(
        getHTML({
          content,
          state,
          styleTags: sheet.getStyleTags(),
          metaTags:
            helmet.title.toString() +
            helmet.meta.toString() +
            helmet.link.toString(),
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
