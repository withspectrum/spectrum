let stripeKey, apiURL;

if (process.env.NODE_ENV === 'development') {
  console.log('DEVELOPMENT');
  stripeKey = 'pk_test_A6pKi4xXOdgg9FrZJ84NW9mP';
  apiURL = 'https://us-central1-spectrum-staging.cloudfunctions.net';
} else {
  stripeKey = 'pk_live_8piI030RqVnqDc8QGTUwUj0Z';
  apiURL = 'https://us-central1-spectrum.cloudfunctions.net';
}

export { apiURL, stripeKey };
