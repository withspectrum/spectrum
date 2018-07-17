import { Router } from 'express';

const IS_PROD = process.env.NODE_ENV === 'production';
const HOME = IS_PROD ? '/' : 'http://localhost:3000/';
const logoutRouter = Router();

logoutRouter.get('/', (req, res) => {
  req.session = null;
  return res.redirect(HOME);
});

export default logoutRouter;
