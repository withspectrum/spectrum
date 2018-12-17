import { Router } from 'express';
const debug = require('debug')('api:routes:auth:logout');
import { destroySession } from '../../models/session';

const IS_PROD = process.env.NODE_ENV === 'production';
const HOME = IS_PROD ? '/' : 'http://localhost:3000/';
const logoutRouter = Router();

logoutRouter.get('/', (req, res) => {
  req.logout();
  return res.redirect(HOME);
});

export default logoutRouter;
