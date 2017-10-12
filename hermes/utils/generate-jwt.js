const env = require('node-env-file');
const IS_PROD = process.env.NODE_ENV === 'production';
const path = require('path');
if (!IS_PROD) {
  env(path.resolve(__dirname, '../../iris/.env'), { raise: false });
}
const jwt = require('jsonwebtoken');

// dataId is an optional third argument which is used to mute specific entities, like a thread, channel, or community. For example, f the user is muting notifications from a channel, then the dataId will represent the channel's id.

export const generateUnsubscribeToken = (userId, type, dataId) => {
  if (!userId || !type) return null;

  let token;
  try {
    token = jwt.sign(
      { userId, type, dataId },
      process.env.EMAIL_JWT_SIGNATURE,
      {
        expiresIn: 60 * 60 * 24 * 7,
      }
    );
  } catch (err) {
    return null;
  }

  if (!token || token === undefined) {
    return null;
  }

  return token;
};
