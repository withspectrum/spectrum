// @flow
const debug = require('debug')('hyperion');
debug('Hyperion starting...');
debug('logging with debug enabled');
require('isomorphic-fetch'); // prevent https://github.com/withspectrum/spectrum/issues/3032
import fs from 'fs';
import express from 'express';
import Loadable from 'react-loadable';
import path from 'path';
import { getUser } from 'api/models/user';
import Raven from 'shared/raven';
import toobusy from 'shared/middlewares/toobusy';
import addSecurityMiddleware from 'shared/middlewares/security';

const PORT = process.env.PORT || 3006;

const app = express();

// Trust the now proxy
app.set('trust proxy', true);

app.use(toobusy);

// Security middleware.
addSecurityMiddleware(app);

if (process.env.NODE_ENV === 'development') {
  const logging = require('shared/middlewares/logging');
  app.use(logging);
}

if (process.env.NODE_ENV === 'production' && !process.env.FORCE_DEV) {
  // Raven (Sentry client) needs to come before everything else
  const raven = require('shared/middlewares/raven').default;
  app.use(raven);
}

// Cross origin request support
import cors from 'shared/middlewares/cors';
app.use(cors);

// Redirect requests to /api and /auth to the production API
// This allows deploy previews to work, as this route would only be called
// if there's no path alias in Now for hyperionurl.com/api, which would only
// happen on deploy previews
app.use('/api', (req: express$Request, res: express$Response) => {
  const redirectUrl = `${req.baseUrl}${req.path}`;
  res.redirect(
    req.method === 'POST' || req.xhr ? 307 : 301,
    `https://spectrum.chat${redirectUrl}`
  );
});

app.use('/auth', (req: express$Request, res: express$Response) => {
  const redirectUrl = `${req.baseUrl}${req.path}`;
  res.redirect(
    req.method === 'POST' || req.xhr ? 307 : 301,
    `https://spectrum.chat${redirectUrl}`
  );
});

app.use('/websocket', (req: express$Request, res: express$Response) => {
  const redirectUrl = `${req.baseUrl}${req.path}`;
  res.redirect(
    req.method === 'POST' || req.xhr ? 307 : 301,
    `https://spectrum.chat${redirectUrl}`
  );
});

// In development the Webpack HMR server requests /sockjs-node constantly,
// so let's patch that through to it!
if (process.env.NODE_ENV === 'development') {
  app.use('/sockjs-node', (req: express$Request, res: express$Response) => {
    res.redirect(301, `http://localhost:3000${req.path}`);
  });
}

import cookieParser from 'cookie-parser';
app.use(cookieParser());

import bodyParser from 'body-parser';
app.use(bodyParser.json());

import session from 'shared/middlewares/session';
app.use(session);

import passport from 'passport';
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  getUser({ id })
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err);
    });
});
app.use(passport.initialize());
app.use(passport.session());

// This needs to come after passport otherwise we'll always redirect logged-in users
import threadParamRedirect from 'shared/middlewares/thread-param';
app.use(threadParamRedirect);

// Static files
// This route handles the case where our ServiceWorker requests main.asdf123.js, but
// we've deployed a new version of the app so the filename changed to main.dfyt975.js
let jsFiles;
try {
  jsFiles = fs.readdirSync(
    path.resolve(__dirname, '..', 'build', 'static', 'js')
  );
} catch (err) {
  // In development that folder might not exist, so ignore errors here
  console.error(err);
}
app.use(
  express.static(path.resolve(__dirname, '..', 'build'), {
    index: false,
    setHeaders: (res, path) => {
      // Don't cache the serviceworker in the browser
      if (path.indexOf('sw.js')) {
        res.setHeader('Cache-Control', 'no-store');
        return;
      }
    },
  })
);
app.get('/static/js/:name', (req: express$Request, res, next) => {
  if (!req.params.name) return next();
  const match = req.params.name.match(/(\w+?)\.(\w+?\.)?js/i);
  if (!match) return next();
  const actualFilename = jsFiles.find(file => file.startsWith(match[1]));
  if (!actualFilename) return next();
  res.redirect(`/static/js/${actualFilename}`);
});

// In dev the static files from the root public folder aren't moved to the build folder by create-react-app
// so we just tell Express to serve those too
if (process.env.NODE_ENV === 'development') {
  app.use(
    express.static(path.resolve(__dirname, '..', 'public'), { index: false })
  );
}

app.get('*', (req: express$Request, res, next) => {
  // Electron requests should only be client-side rendered
  if (req.headers['user-agent'].indexOf('Electron') > -1) {
    return res.sendFile(path.resolve(__dirname, '../build/index.html'));
  }
  next();
});

import cache from './cache';
app.use(cache);

import renderer from './renderer';
app.get('*', renderer);

process.on('unhandledRejection', async err => {
  console.error('Unhandled rejection', err);
  try {
    await new Promise(res => Raven.captureException(err, res));
  } catch (err) {
    console.error('Raven error', err);
  } finally {
    process.exit(1);
  }
});

process.on('uncaughtException', async err => {
  console.error('Uncaught exception', err);
  try {
    await new Promise(res => Raven.captureException(err, res));
  } catch (err) {
    console.error('Raven error', err);
  } finally {
    process.exit(1);
  }
});

Loadable.preloadAll().then(() => {
  app.listen(PORT);
  debug(
    `Hyperion, the server-side renderer, running at http://localhost:${PORT}`
  );
});
