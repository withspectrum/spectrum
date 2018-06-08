// @flow
import Raven from 'raven-js';
if (
  process.env.NODE_ENV === 'production' &&
  process.env.SENTRY_DSN_CLIENT &&
  process.env.SENTRY_DSN_CLIENT !== 'undefined'
) {
  Raven.config(process.env.SENTRY_DSN_CLIENT, {
    whitelistUrls: [/spectrum\.chat/, /www\.spectrum\.chat/],
    environment: process.env.NODE_ENV,
  }).install();
} else {
  console.warn('Raven not enabled locally');
}
