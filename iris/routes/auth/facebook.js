// @flow
import { Router } from 'express';
import passport from 'passport';
import isSpectrumUrl from '../../utils/is-spectrum-url';

const IS_PROD = process.env.NODE_ENV === 'production';
const FALLBACK_URL = IS_PROD ? '/home' : 'http://localhost:3000/home';

const facebookAuthRouter = Router();

// Redirect the user to Twitter for authentication. When complete, Twitter
// will redirect the user back to the application at /auth/twitter/callback
facebookAuthRouter.get('/', (req, ...rest) => {
  let url = FALLBACK_URL;
  if (req.query.r && isSpectrumUrl(req.query.r)) {
    url = req.query.r;
  }

  // Attach the redirectURL to the session so we have it in the /auth/twitter/callback route
  req.session.redirectURL = url;
  return new Promise(res => {
    // Save the new session data to the database before redirecting
    req.session.save(err => {
      res(
        passport.authenticate('facebook', { scope: ['email'] })(req, ...rest)
      );
    });
  });
});

// Twitter will redirect the user to this URL after approval. Finish the
// authentication process by attempting to obtain an access token. If
// access was granted, the user will be logged in. Otherwise, authentication has failed.
facebookAuthRouter.get(
  '/callback',
  passport.authenticate('facebook', {
    failureRedirect: IS_PROD ? '/' : 'http://localhost:3000/',
  }),
  (req, res) => {
    // req.session.redirectURL is set in the /auth/twitter route
    // if it's not set due to some error fallback to the default
    const redirectUrl = req.session.redirectURL || FALLBACK_URL;

    // Delete the redirectURL from the session again so we don't redirect
    // to the old URL the next time around
    if (req.session.redirectURL) {
      req.session.redirectURL = undefined;
      return new Promise(resolve => {
        req.session.save(err => {
          if (err) console.log(err);
          resolve(res.redirect(redirectUrl));
        });
      });
    }

    res.redirect(redirectUrl);
  }
);

export default facebookAuthRouter;
