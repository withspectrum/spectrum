/**
 * The entry point for the server, this is where everything starts
 */
const { createServer } = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const { SubscriptionServer } = require('subscriptions-transport-ws');

const { init } = require('./models/db');
const listeners = require('./subscriptions');
const subscriptionManager = require('./subscriptions/manager');

const schema = require('./schema');

const PORT = 3001;
const WS_PORT = 5000;
const DB_PORT = 28015;
const HOST = 'localhost';

console.log('Server starting...');

// API server
const app = express();
app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/',
    query: `query getCommunity($id: ID!) {\n  community(id: $id) {\n    name\n    frequencies {\n      name\n      stories {\n        content {\n          title\n          description\n          media\n        }\n      }\n    }\n  }\n}`,
    variables: { id: 'spectrum-staging' },
  }),
);
app.use('/', bodyParser.json(), graphqlExpress({ schema }));

// Create the websocket server, make it 404 for all requests
const websocketServer = createServer((req, res) => {
  res.writeHead(404);
  res.end();
});

// Connect to the database, then start the server
init({ host: HOST, port: DB_PORT }).then(() => {
  // Start webserver
  app.listen(PORT);

  // Start websockets server
  websocketServer.listen(WS_PORT);

  // Start subscriptions server
  const subscriptionsServer = new SubscriptionServer(
    {
      subscriptionManager,
    },
    {
      server: websocketServer,
    },
  );

  // Start database listeners
  listeners.start();
  console.log(`GraphQL server running at http://${HOST}:${PORT}`);
  console.log(`Websocket server running at http://${HOST}:${WS_PORT}`);
});
