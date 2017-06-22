// @flow
import { Router } from 'express';
import { destroySession } from '../../models/session';

const IS_PROD = process.env.NODE_ENV === 'production';
const HOME = IS_PROD ? '/' : 'http://localhost:3000/';
const logoutRouter = Router();

logoutRouter.get('/', (req, res) => {
  const sessionCookie = req.cookies['connect.sid'];
  if (req.isUnauthenticated() || !sessionCookie) {
    return res.redirect(HOME);
  }
  const sessionId = sessionCookie.split('.')[0].replace('s:', '');
  return destroySession(sessionId)
    .then(() => {
      // I should not have to do this manually
      // but it doesn't work otherwise ¯\_(ツ)_/¯
      res.clearCookie('connect.sid');
      req.logout();
      res.redirect(HOME);
    })
    .catch(err => {
      res.clearCookie('connect.sid');
      console.log(err);
      res.redirect(HOME);
    });
});

export default logoutRouter;
