import { Router } from 'express';
const debug = require('debug')('iris:routes:auth:logout');
import { destroySession } from '../../models/session';

const IS_PROD = process.env.NODE_ENV === 'production';
const HOME = IS_PROD ? '/' : 'http://localhost:3000/';
const logoutRouter = Router();

logoutRouter.get('/', (req, res) => {
  debug('started');
  const sessionCookie = req.cookies['connect.sid'];
  if (req.isUnauthenticated() || !sessionCookie) {
    debug('is unauthenticated, aborting logout');
    return res.redirect(HOME);
  }
  debug('logging out');
  req.logout();
  req.session.destroy(err => {
    if (err) console.log(err);
    debug(`destroyed session, redirecting`);
    res.redirect(HOME);
  });
});

export default logoutRouter;
