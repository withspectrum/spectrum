// @flow
import { Router } from 'express';
const debug = require('debug')('iris:routes:auth:logout');
import { destroySession } from '../../models/session';

const IS_PROD = process.env.NODE_ENV === 'production';
const HOME = IS_PROD ? '/' : 'http://localhost:3000/';
const logoutRouter = Router();

logoutRouter.get('/', (req, res) => {
  debug('visiting');
  const sessionCookie = req.cookies['connect.sid'];
  if (req.isUnauthenticated() || !sessionCookie) {
    debug('is unauthenticated, aborting logout');
    return res.redirect(HOME);
  }
  const sessionId = sessionCookie.split('.')[0].replace('s:', '');
  return destroySession(sessionId)
    .then(() => {
      debug(`destroyed session ${sessionId}`);
      // I should not have to do this manually
      // but it doesn't work otherwise ¯\_(ツ)_/¯
      res.clearCookie('connect.sid');
      req.logout();
      res.redirect(HOME);
      debug('done');
    })
    .catch(err => {
      debug(`failed destroying session ${sessionId}`);
      res.clearCookie('connect.sid');
      console.log(err);
      res.redirect(HOME);
      debug('done');
    });
});

export default logoutRouter;
