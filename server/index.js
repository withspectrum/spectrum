const { createServer } = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const listeners = require('./subscriptions');
const { init } = require('./models/db');
const subscriptionManager = require('./subscriptions/manager');

const schema = require('./schema');

const PORT = 3001;
const WS_PORT = 5000;

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
init({ host: 'localhost', port: 28015 }).then(() => {
  app.listen(PORT);
  websocketServer.listen(WS_PORT);
  // Create a subscriptions server
  const subscriptionsServer = new SubscriptionServer(
    {
      subscriptionManager,
    },
    {
      server: websocketServer,
    },
  );
  listeners.start();
  console.log('GraphQL server running on port', PORT);
});
