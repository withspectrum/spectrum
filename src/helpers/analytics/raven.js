import Raven from 'raven-js';
if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN_CLIENT) {
  Raven.config(process.env.SENTRY_DSN_CLIENT, {
    whitelistUrls: [/spectrum\.chat/, /www\.spectrum\.chat/],
    environment: process.env.NODE_ENV,
  }).install();
} else {
  console.error('Raven not enabled locally');
}
