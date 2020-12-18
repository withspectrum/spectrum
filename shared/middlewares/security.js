// @flow
const hpp = require('hpp');
const helmet = require('helmet');
const uuid = require('uuid');
const hsts = require('hsts');
const express_enforces_ssl = require('express-enforces-ssl');
const IS_PROD = process.env.NODE_ENV === 'production' && !process.env.FORCE_DEV;

function securityMiddleware(
  server: express$Application,
  { enableNonce, enableCSP }: { enableNonce: boolean, enableCSP: boolean }
) {
  // Don't expose any software information to hackers.
  server.disable('x-powered-by');

  // Prevent HTTP Parameter pollution.
  server.use(hpp());

  if (IS_PROD) {
    server.use(
      hsts({
        // 5 mins in seconds
        // we will scale this up incrementally to ensure we dont break the
        // app for end users
        // see deployment recommendations here https://hstspreload.org/?domain=spectrum.chat
        maxAge: 300,
        includeSubDomains: true,
        preload: true,
      })
    );

    server.use(express_enforces_ssl());
  }

  // The xssFilter middleware sets the X-XSS-Protection header to prevent
  // reflected XSS attacks.
  // @see https://helmetjs.github.io/docs/xss-filter/
  server.use(helmet.xssFilter());

  // Frameguard mitigates clickjacking attacks by setting the X-Frame-Options header.
  // @see https://helmetjs.github.io/docs/frameguard/
  server.use(helmet.frameguard('deny'));

  // Sets the X-Download-Options to prevent Internet Explorer from executing
  // downloads in your site’s context.
  // @see https://helmetjs.github.io/docs/ienoopen/
  server.use(helmet.ieNoOpen());

  // Don’t Sniff Mimetype middleware, noSniff, helps prevent browsers from trying
  // to guess (“sniff”) the MIME type, which can have security implications. It
  // does this by setting the X-Content-Type-Options header to nosniff.
  // @see https://helmetjs.github.io/docs/dont-sniff-mimetype/
  server.use(helmet.noSniff());

  if (enableNonce) {
    // Attach a unique "nonce" to every response. This allows use to declare
    // inline scripts as being safe for execution against our content security policy.
    // @see https://helmetjs.github.io/docs/csp/
    server.use(
      (
        request: express$Request,
        response: express$Response,
        next: express$NextFunction
      ) => {
        response.locals.nonce = uuid.v4();
        next();
      }
    );
  }

  // Content Security Policy (CSP)
  // It can be a pain to manage these, but it's a really great habit to get in to.
  // @see https://helmetjs.github.io/docs/csp/
  const cspConfig = {
    directives: {
      // The default-src is the default policy for loading content such as
      // JavaScript, Images, CSS, Fonts, AJAX requests, Frames, HTML5 Media.
      // As you might suspect, is used as fallback for unspecified directives.
      defaultSrc: ["'self'"],

      // Defines valid sources of JavaScript.
      scriptSrc: [
        "'self'",
        "'unsafe-eval'",
        'cdn.ravenjs.com',
        'cdn.polyfill.io',

        // Note: We will execution of any inline scripts that have the following
        // nonce identifier attached to them.
        // This is useful for guarding your application whilst allowing an inline
        // script to do data store rehydration (redux/mobx/apollo) for example.
        // @see https://helmetjs.github.io/docs/csp/
        (request, response) => `'nonce-${response.locals.nonce}'`,
      ],

      // Defines the origins from which images can be loaded.
      // @note: Leave open to all images, too much image coming from different servers.
      imgSrc: ['https:', 'http:', "'self'", 'data:', 'blob:'],

      // Defines valid sources of stylesheets.
      styleSrc: ["'self'", "'unsafe-inline'"],

      // Applies to XMLHttpRequest (AJAX), WebSocket or EventSource.
      // If not allowed the browser emulates a 400 HTTP status code.
      connectSrc: ['https:', 'wss:'],

      // lists the URLs for workers and embedded frame contents.
      // For example: child-src https://youtube.com would enable
      // embedding videos from YouTube but not from other origins.
      // @note: we allow users to embed any page they want.
      childSrc: ['https:', 'http:'],

      // allows control over Flash and other plugins.
      objectSrc: ["'none'"],

      // restricts the origins allowed to deliver video and audio.
      mediaSrc: ["'none'"],
    },

    // Set to true if you only want browsers to report errors, not block them.
    reportOnly:
      process.env.NODE_ENV === 'development' || process.env.FORCE_DEV || false,
    // Necessary because of Vercel CDN usage
    browserSniff: false,
  };

  if (enableCSP) {
    server.use(helmet.contentSecurityPolicy(cspConfig));
  }
}

module.exports = securityMiddleware;
