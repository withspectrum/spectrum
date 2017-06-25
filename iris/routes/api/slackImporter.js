// @flow
import { Router } from 'express';
import UserError from '../../utils/UserError';
import { getCommunities } from '../../models/community';
import {
  createSlackImportRecord,
  generateOAuthToken,
} from '../../models/slackImport';
const slackRouter = Router();

slackRouter.get('/', (req, res) => {
  const code = req.query.code;
  const communityId = req.query.state;
  const userId = req.user.id;

  // generate an oauth token. This token will be used to communicate with the Slack API to get user information, and we'll store the token in the db record to allow for the user to access their Slack team info in the future.
  return generateOAuthToken(code)
    .then(data => {
      if (!data) return new UserError('No token generated for this Slack team');
      const token = data.access_token;
      const teamName = data.team_name;
      const teamId = data.team_id;
      const input = {
        token,
        teamName,
        teamId,
        userId,
        communityId,
      };
      return createSlackImportRecord(input);
    })
    .then(() => {
      // once the record has been created we can redirect the user back to Spectrum to finish the importing flow. To do this we'll get the community:
      return getCommunities([communityId]).then(data => data[0].slug);
    })
    .then(community => {
      res.redirect(`http://localhost:3000/${community}/settings`);
    });
});

export default slackRouter;
