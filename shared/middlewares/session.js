// @flow
import session from 'cookie-session';
import { cookieKeygrip } from '../cookie-utils';

const ONE_YEAR = 31556952000;

if (!process.env.SESSION_COOKIE_SECRET && !process.env.TEST_DB) {
  throw new Error(
    '[shared/middlewares/session] You have to provide the SESSION_COOKIE_SECRET environment variable.'
  );
}

// Create session middleware
export default session({
  keys: cookieKeygrip,
  name: 'session',
  secure: process.env.NODE_ENV === 'production',
  // Expire the browser cookie one year from now
  maxAge: ONE_YEAR,
  signed: process.env.TEST_DB ? false : true,
});
