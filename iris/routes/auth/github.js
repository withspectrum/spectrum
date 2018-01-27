import { Router } from 'express';
import passport from 'passport';
import { URL } from 'url';
import isSpectrumUrl from '../../utils/is-spectrum-url';

const IS_PROD = process.env.NODE_ENV === 'production';
const FALLBACK_URL = IS_PROD
  ? 'https://spectrum.chat/home'
  : 'http://localhost:3000/home';

const githubAuthRouter = Router();

// Redirect the user to Twitter for authentication. When complete, Twitter
// will redirect the user back to the application at /auth/twitter/callback
githubAuthRouter.get('/', (req, ...rest) => {
  let url = FALLBACK_URL;
  if (req.query.r && isSpectrumUrl(req.query.r)) {
    url = req.query.r;
  }

  // Attach the redirectURL to the session so we have it in the /auth/twitter/callback route
  req.session.redirectUrl = url;

  return passport.authenticate('github', { scope: ['user'] })(req, ...rest);
});

// Twitter will redirect the user to this URL after approval. Finish the
// authentication process by attempting to obtain an access token. If
// access was granted, the user will be logged in. Otherwise, authentication has failed.
githubAuthRouter.get(
  '/callback',
  passport.authenticate('github', {
    failureRedirect: IS_PROD ? '/' : 'http://localhost:3000/',
  }),
  (req, res) => {
    // req.session.redirectURL is set in the /auth/twitter route
    if (!req.session.redirectUrl) return res.redirect(FALLBACK_URL);

    const redirectUrl = new URL(req.session.redirectUrl);
    redirectUrl.searchParams.append('authed', 'true');

    // Add the session cookies to the query params if authenticating from mobile
    // if (
    //   isExpoUrl(req.session.redirectUrl) &&
    //   req.cookies &&
    //   req.cookies.session
    // ) {
    //   redirectUrl.searchParams.append('session', req.cookies.session);
    //   redirectUrl.searchParams.append(
    //     'session.sig',
    //     req.cookies['session.sig']
    //   );
    // }

    // Delete the redirectURL from the session again so we don't redirect
    // to the old URL the next time around
    req.session.redirectUrl = undefined;
    return res.redirect(redirectUrl.href);
  }
);

export default githubAuthRouter;
