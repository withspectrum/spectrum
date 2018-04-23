// @flow
const hpp = require('hpp');
const helmet = require('helmet');

// $FlowFixMe
function securityMiddleware(server) {
  // Don't expose any software information to hackers.
  server.disable('x-powered-by');

  // Prevent HTTP Parameter pollution.
  server.use(hpp());

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
}

module.exports = securityMiddleware;
