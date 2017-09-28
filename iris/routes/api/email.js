const env = require('node-env-file');
const IS_PROD = process.env.NODE_ENV === 'production';
const path = require('path');
if (!IS_PROD) {
  env(path.resolve(__dirname, '../.env'), { raise: false });
}
import { Router } from 'express';
const jwt = require('jsonwebtoken');
const emailRouter = Router();
import { unsubscribeUserFromEmailNotification } from '../../models/usersSettings';
import { processInvoicePaid } from '../webhooks';

emailRouter.get('/unsubscribe', async (req, res) => {
  const { token } = req.query;

  // if no token was provided
  if (!token) return res.status(400).send('No token found to unsubscribe');

  // verify that the token signature matches our env signature
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.EMAIL_JWT_SIGNATURE);
  } catch (err) {
    // if the signature can't be verified
    return res.status(400).send('Token not valid');
  }

  // once the token is verified, we can decode it to get the userId and type
  const { userId, type } = jwt.decode(token);

  // if the token doesn't have the necessary info
  if (!userId || !type) {
    return res.status(400).send('Token body not valid');
  }

  // and send a database request to unsubscribe from a particular email type
  try {
    return unsubscribeUserFromEmailNotification(userId, type).then(() =>
      res.status(200).send('Unsubscribe request completed')
    );
  } catch (err) {
    console.log(err);
    return res.status(400).send('Error unsubscribing from this email');
  }
});

export default emailRouter;
