// @flow
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { db } from '../models/db';
import { decode } from './base64';

const ONE_YEAR = 31556952000;
const ONE_DAY = 86400000;
// NOTE(@mxstbr): 1Password generated this, LGTM!
export const SESSION_COOKIE_SECRET = process.env.TEST_DB
  ? ''
  : 't3BUqGYFHLNjb7V8xjY6QLECgWy7ByWTYjKkPtuP%R.uLfjNBQKr9pHuKuQJXNqo';

// We need a custom cookie parser for session cookies to do auth in websockets
export const sessionCookieParser = cookieParser(SESSION_COOKIE_SECRET);

/**
 * Get the sessions' users' ID of a req manually, needed for websocket authentication
 */
export const getUserIdFromReq = (req: any): Promise<string> =>
  new Promise((res, rej) => {
    sessionCookieParser(req, null, err => {
      if (err) return rej(err);

      const sessionId = req.cookies['connect.sid'];
      if (!sessionId) return rej();
      let user;
      try {
        let { passport } = JSON.parse(decode(sessionId));
        user = passport.user;
      } catch (err) {
        return rej();
      }
      return res(user);
    });
  });
