// @flow
require('now-env');
const jwt = require('jsonwebtoken');

// dataId is an optional third argument which is used to mute specific entities, like a thread, channel, or community. For example, f the user is muting notifications from a channel, then the dataId will represent the channel's id.
export const generateUnsubscribeToken = (
  userId: string,
  type: string,
  dataId: ?string
) => {
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

export const generateEmailValidationToken = (
  userId: string,
  email: string,
  communityId?: string
) => {
  if (!userId || !email) return null;

  let token;
  try {
    token = jwt.sign(
      { userId, email, communityId },
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
