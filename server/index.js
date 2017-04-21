/**
 * The entry point for the server, this is where everything starts
 */
const { createServer } = require('http');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const SessionStore = require('session-rethinkdb')(session);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const env = require('node-env-file');

const { returnPaymentsError } = require('./utils');
const { db } = require('./models/db');
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

// to use local env variables in order to not commit our stripe keys
if (app.get('env') === 'development') {
  env(__dirname + '/.env');
}

// set stripe key
app.set('stripeKey', process.env.STRIPE_KEY);
const stripeKey = app.get('stripeKey');
const stripe = require('stripe')(stripeKey), currency = 'USD';

// the token comes from the client side stripe integration, which contains
// payment and customer information, tokenized, which can be used to create a
// subscription.
// the plan is a string that maps to our subscriptions created in stripe
app.post('/payments/subscriptions/create', (req, res) => {
  const token = JSON.parse(req.body.token);
  const plan = req.body.plan;

  if (!token) return res.json({ success: false, error: 'No token detected.' });
  if (!plan) return res.json({ success: false, error: 'No plan detected.' });

  stripe.customers.create(
    { email: token.email, source: token.id },
    (err, customer) => {
      if (err) returnError(res, err);

      // after the customer is created, charge them and put them on the subscription
      stripe.subscriptions.create(
        { plan: plan, customer: customer.id },
        (err, subscription) => {
          // unable to create the subscription
          if (err) returnError(res, err);

          // send back a response once we know the customer and subscription worked
          return res.json({
            success: true,
            customerId: customer.id,
            customerEmail: token.email,
            subscriptionId: subscription.id,
            tokenId: token.id,
            subscriptionName: subscription.plan.name,
            created: subscription.created,
            amount: subscription.plan.amount,
          });
        }
      );
    }
  );
});

app.post('/payments/subscriptions/delete', (req, res) => {
  const subscriptionId = req.body.subscriptionId.toString();
  if (!subscriptionId)
    return res.json({ success: false, error: 'No subscription found' });

  stripe.subscriptions.del(subscriptionId, (err, confirmation) => {
    if (err) return res.json({ success: false, error: err });

    return res.json({
      success: true,
    });
  });
});

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/',
    subscriptionsEndpoint: `ws://localhost:5000`,
    query: `{\n  user(id: "58a023a4-912d-48fe-a61c-eec7274f7699") {\n    displayName\n    username\n    communities {\n      name\n      frequencies {\n        name\n        stories {\n          content {\n            title\n          }\n          messages {\n            message {\n              content\n            }\n          }\n        }\n      }\n    }\n  }\n}`,
  })
);
app.use(cookieParser());
app.use(bodyParser());
app.use(
  session({
    store: new SessionStore(db, {
      db: 'spectrum',
      table: 'sessions',
    }),
    // NOTE(@mxstbr): 1Password generated this, LGTM!
    secret: 't3BUqGYFHLNjb7V8xjY6QLECgWy7ByWTYjKkPtuP%R.uLfjNBQKr9pHuKuQJXNqo',
    resave: true,
    saveUninitialized: false,
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
console.log(`Websocket server running at ws://${HOST}:${WS_PORT}`);
