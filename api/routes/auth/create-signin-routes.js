/* @flow
 *
 * A reusable set of routes for signing in with different providers. Handles token-based authentication.
 * Usage:
 *
 * const { main, callbacks } = createSigninRoutes('facebook');
 * facebookRouter.get('/', main);
 * facebookRouter.get('/callback', ...callbacks);
 */
import passport from 'passport';
import { URL } from 'url';
import isSpectrumUrl from '../../utils/is-spectrum-url';

const IS_PROD = process.env.NODE_ENV === 'production';
const FALLBACK_URL = IS_PROD
  ? 'https://spectrum.chat/home'
  : 'http://localhost:3000/home';

type Strategy = 'twitter' | 'facebook' | 'github' | 'google';

export const createSigninRoutes = (
  strategy: Strategy,
  strategyOptions?: Object
) => {
  return {
    // The main route takes care of storing the redirect URL in the session
    // and passing the right options
    main: (req: express$Request, ...rest: any) => {
      let url = FALLBACK_URL;
      if (typeof req.query.r === 'string' && isSpectrumUrl(req.query.r)) {
        url = req.query.r;
      }

      // Attach the redirectURL and authType to the session so we have it in the /auth/twitter/callback route
      // $FlowIssue
      req.session.redirectUrl = url;

      return passport.authenticate(strategy, strategyOptions)(req, ...rest);
    },
    // The callbacks take care of authenticating, setting the response cookies,
    // redirecting to the right place and handling tokens
    callbacks: [
      passport.authenticate(strategy, {
        failureRedirect: IS_PROD
          ? '/new/user'
          : 'http://localhost:3000/new/user',
      }),
      (req: express$Request, res: express$Response) => {
        // $FlowIssue
        const redirectUrl = req.session.redirectUrl
          ? new URL(req.session.redirectUrl)
          : new URL(FALLBACK_URL);
        redirectUrl.searchParams.append('authed', 'true');
        if (req.authInfo && req.authInfo.message) {
          redirectUrl.searchParams.append(
            'toastMessage',
            // $FlowIssue
            req.authInfo.message
          );
          redirectUrl.searchParams.append('toastType', 'error');
        }

        // Delete the redirectURL from the session again so we don't redirect
        // to the old URL the next time around
        // $FlowIssue
        req.session.redirectUrl = undefined;
        res.cookie('_now_no_cache', '1', {
          maxAge: 315569260000, // 10 years
          sameSite: 'lax',
          secure: false,
        });
        return res.redirect(redirectUrl.href);
      },
    ],
  };
};
