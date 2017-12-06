// @flow
import { SESSION_COOKIE_SECRET } from 'iris/utils/session-store';
import session from 'cookie-session';

const ONE_YEAR = 31556952000;

// Create session middleware
export default session({
  keys: [SESSION_COOKIE_SECRET],
  name: 'connect.sid',
  secure: process.env.NODE_ENV === 'production',
  // Expire the browser cookie one year from now
  maxAge: ONE_YEAR,
});
