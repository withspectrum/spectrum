// @flow
import { Router } from 'express';
const slackRouter = Router();

slackRouter.get('/', (req, res) => {
  const code = req.query.code;
  const communityId = req.query.state;
  const user = req.user;

  console.log('code', code);
  console.log('communityId', communityId);
  console.log('user', user);

  // store a record of the
  // const importRecord = createSlackImport(code, user, communityId);
  // const oauthToken = generateOAuthToken(code);
  // const communityRecord = getCommunities([communityId]);

  // return Promise.all([
  //   importRecord,
  //   oauthToken,
  //   communityRecord,
  // ]).then(([record, token, community]) => {});
});

export default slackRouter;
