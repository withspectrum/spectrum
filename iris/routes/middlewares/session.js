// @flow
import session from 'express-session';
import sessionStore, { SESSION_COOKIE_SECRET } from '../../utils/session-store';

const ONE_YEAR = 31556952000;

// Create session middleware
export default session({
  store: sessionStore,
  secret: SESSION_COOKIE_SECRET,
  // Forces the session to be saved back to the session store, even if the session was never modified during the request.
  // Necessary with the RethinkDB session store, ref: llambda/session-rethinkdb#6
  resave: true,
  // Forces a session that is "uninitialized" to be saved to the store
  // NOTE(@mxstbr): This might not be necessary or even useful, but the default example of
  // session-rethinkdb uses it. Ref: llambda/session-rethinkdb#12
  saveUninitialized: true,
  // Force a session identifier cookie to be set on every response, resets the expire date of the
  // cookie to one year from the time of the response, meaning you'll only get logged out after a
  // year of inactivity.
  rolling: true,
  cookie: {
    // Don't let the cookie be accessible via JavaScript document.cookie
    httpOnly: true,
    // NOTE(@mxstbr): This should be set to true to prevent the cookie to be sent over HTTP. (only HTTPS)
    // The issue is that setting this to true breaks the sessions when deploying with now.sh because
    // they run behind some proxy.
    // We might have to use app.set('trust proxy') or something like that to avoid this issue,
    // but it's not super high priority since sending over HTTP doesn't hurt anybody.
    secure: false,
    // Expire the browser cookie one year from now
    maxAge: ONE_YEAR,
  },
});
