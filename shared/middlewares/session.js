// @flow
import session from 'cookie-session';
import { cookieKeygrip } from '../cookie-utils';

const ONE_WEEK = 604800000;

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
  // This is refresh everytime a user does a request
  // @see api/routes/middleware/index.js
  maxAge: ONE_WEEK,
  signed: process.env.TEST_DB ? false : true,
  sameSite: 'lax',
});
