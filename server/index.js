/**
 * The entry point for the server, this is where everything starts
 */
const { createServer } = require('http');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const { SubscriptionServer } = require('subscriptions-transport-ws');

const { init: initDatabase } = require('./models/db');
const listeners = require('./subscriptions');
const subscriptionManager = require('./subscriptions/manager');

const schema = require('./schema');
const { init: initPassport } = require('./authentication.js');

const PORT = 3001;
const WS_PORT = 5000;
const DB_PORT = 28015;
const HOST = 'localhost';
const IS_PROD = process.env.NODE_ENV === 'production';

console.log('Server starting...');

// Initialize authentication
initPassport({
  twitterCallbackURLBase: IS_PROD
    ? 'https://spectrum.chat'
    : 'http://localhost:3001',
});
// API server
const app = express();
app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/',
    query: `{\n  user(id: "58a023a4-912d-48fe-a61c-eec7274f7699") {\n    displayName\n    username\n    communities {\n      name\n      frequencies {\n        name\n        stories {\n          content {\n            title\n          }\n          messages {\n            message {\n              content\n            }\n          }\n        }\n      }\n    }\n  }\n}`,
  })
);
app.use(cookieParser());
app.use(bodyParser());
app.use(
  session({
    // NOTE(@mxstbr): 1Password generated this, LGTM!
    secret: 't3BUqGYFHLNjb7V8xjY6QLECgWy7ByWTYjKkPtuP%R.uLfjNBQKr9pHuKuQJXNqo',
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Redirect the user to Twitter for authentication.  When complete, Twitter
// will redirect the user back to the application at
//   /auth/twitter/callback
app.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);
app.use('/', graphqlExpress({ schema }));

// Create the websocket server, make it 404 for all requests to HTTP(S) port(s)
const websocketServer = createServer((req, res) => {
  res.writeHead(404);
  res.end();
});

// Connect to the database, then start the server
initDatabase({ host: HOST, port: DB_PORT }).then(() => {
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
    }
  );

  // Start database listeners
  listeners.start();
  console.log(`GraphQL server running at http://${HOST}:${PORT}`);
  console.log(`Websocket server running at http://${HOST}:${WS_PORT}`);
});
