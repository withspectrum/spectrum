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
  if (!token) return res.status(400).send('No token provided to unsubscribe.');

  // verify that the token signature matches our env signature
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.EMAIL_JWT_SIGNATURE);
  } catch (err) {
    // if the signature can't be verified
    let errMessage;
    if (err.name === 'TokenExpiredError') {
      errMessage =
        'This unsubscribe token has expired. You can unsubscribe from this email type in your user settings.';
    } else {
      errMessage =
        'This unsubscribe token is invalid. You can unsubscribe from this email type in your user settings.';
    }
    return res.status(400).send(errMessage);
  }

  // once the token is verified, we can decode it to get the userId and type
  const { userId, type } = jwt.decode(token);

  // if the token doesn't have the necessary info
  if (!userId || !type) {
    return res
      .status(400)
      .send(
        'We were not able to verify this request to unsubscribe. You can unsubscribe from this email type in your users settings.'
      );
  }

  // and send a database request to unsubscribe from a particular email type
  try {
    return unsubscribeUserFromEmailNotification(userId, type).then(() =>
      res
        .status(200)
        .send('You have been successfully unsubscribed from this email.')
    );
  } catch (err) {
    return res
      .status(400)
      .send(
        'We ran into an issue unsubscribing you from this email. You can always unsubscribe from this email type in your user settings, or get in touch with us at hi@spectrum.chat.'
      );
  }
});

export default emailRouter;
