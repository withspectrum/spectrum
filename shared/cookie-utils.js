// @flow
import Keygrip from 'keygrip';
import jwt from 'jsonwebtoken';

export const cookieKeygrip = new Keygrip([process.env.SESSION_COOKIE_SECRET]);

export const getCookies = ({ userId }: { userId: string }) => {
  // The value of our "session" cookie
  const session = new Buffer(
    JSON.stringify({ passport: { user: userId } })
  ).toString('base64');
  // The value of our "session.sig" cookie
  const sessionSig = cookieKeygrip.sign(`session=${session}`);

  return { session, 'session.sig': sessionSig };
};

export const signCookie = (cookie: string) => {
  return jwt.sign({ cookie }, process.env.API_TOKEN_SECRET, {
    expiresIn: '25y',
  });
};
