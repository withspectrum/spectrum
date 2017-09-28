const env = require('node-env-file');
const IS_PROD = process.env.NODE_ENV === 'production';
const path = require('path');
if (!IS_PROD) {
  env(path.resolve(__dirname, '../../iris/.env'), { raise: false });
}
const jwt = require('jsonwebtoken');

export const generateUnsubscribeToken = (userId, type) => {
  if (!userId || !type)
    return new Error('Insufficient arguments to generate token');
  let token;
  try {
    token = jwt.sign({ userId, type }, process.env.EMAIL_JWT_SIGNATURE, {
      expiresIn: 60 * 60 * 24 * 7,
    });
  } catch (err) {
    return new Error('Error generating token', err.message);
  }

  if (!token || token === undefined) return new Error('Token not generated');
  return token;
};
