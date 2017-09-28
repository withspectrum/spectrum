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
