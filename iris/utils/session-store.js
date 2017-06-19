// @flow
import session from 'express-session';
import RethinkSessionStore from 'session-rethinkdb';
import cookieParser from 'cookie-parser';
import { db } from '../models/db';

const ONE_YEAR = 31556952000;
const ONE_DAY = 86400000;
// NOTE(@mxstbr): 1Password generated this, LGTM!
export const SESSION_COOKIE_SECRET =
  't3BUqGYFHLNjb7V8xjY6QLECgWy7ByWTYjKkPtuP%R.uLfjNBQKr9pHuKuQJXNqo';

// We need a custom cookie parser for session cookies to do auth in websockets
export const sessionCookieParser = cookieParser(SESSION_COOKIE_SECRET);

/**
 * Get the sessions' users' ID of a req manually, needed for websocket authentication
 */
export const getUserIdFromReq = (req: any): Promise<string> =>
  new Promise((res, rej) => {
    sessionCookieParser(req, null, err => {
      if (err) return rej(err);

      const sessionId = req.signedCookies['connect.sid'];
      if (!sessionId) return rej();
      sessionStore.get(sessionId, (err, session) => {
        if (err || !session || !session.passport || !session.passport.user) {
          return rej(err);
        }

        return res(session.passport.user);
      });
    });
  });

const SessionStore = RethinkSessionStore(session);

const sessionStore = new SessionStore(db, {
  db: 'spectrum',
  table: 'sessions',
  // I'm a bit unclear what this does, it's set to 60 seconds by default
  // so it might be how long after the cookie expires we clear it? Anyway, setting it to
  // one year like the cookie can't hurt.
  browserSessionsMaxAge: ONE_YEAR,
  // Clear expired cookies once a day
  // The default is 60 seconds, but that puts unnecessary load on the database. Once a day should
  // be perfectly fine.
  clearInterval: ONE_DAY,
});

export default sessionStore;
