// @flow
import session from 'shared/middlewares/session';

const ONE_YEAR = 31556952000;
const ONE_DAY = 86400000;

/**
 * Get the sessions' users' ID of a req manually, needed for websocket authentication
 */
export const getUserIdFromReq = (req: any): Promise<?string> =>
  new Promise((res, rej) => {
    session(req, {}, err => {
      if (err) {
        return rej(err);
      }
      if (!req.session || !req.session.passport || !req.session.passport.user) {
        return res(null);
      }

      // NOTE(@mxstbr): `req.session.passport.user` used to be just the userID, but is now the full user data
      // JSON.stringified to avoid having to go to the db on every single request. We have to handle both
      // cases here to get the ID.
      let id;
      try {
        const user = JSON.parse(req.session.passport.user);
        id = user.id;
      } catch (err) {
        id = req.session.passport.user;
      }

      return res(id);
    });
  });
