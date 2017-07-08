// @flow
import { Router } from 'express';
import UserError from '../../utils/UserError';
import { getCommunities } from '../../models/community';
import {
  createSlackImportRecord,
  generateOAuthToken,
} from '../../models/slackImport';

const IS_PROD = process.env.NODE_ENV === 'production';

const slackRouter = Router();

slackRouter.get('/', (req, res) => {
  const code = req.query.code;
  const communityId = req.query.state;
  const senderId = req.user.id;
  const returnURI = IS_PROD
    ? `https://spectrum.chat/api/slack`
    : `http://localhost:3001/api/slack`;

  // generate an oauth token. This token will be used to communicate with the Slack API to get user information, and we'll store the token in the db record to allow for the user to access their Slack team info in the future.
  return generateOAuthToken(code, returnURI)
    .then(data => {
      if (!data) return new UserError('No token generated for this Slack team');
      const token = data.access_token;
      const teamName = data.team_name;
      const teamId = data.team_id;
      const input = {
        token,
        teamName,
        teamId,
        senderId,
        communityId,
      };
      return createSlackImportRecord(input);
    })
    .then(() => {
      // once the record has been created we can redirect the user back to Spectrum to finish the importing flow. To do this we'll get the community:
      return getCommunities([communityId]).then(data => data[0].slug);
    })
    .then(community => {
      return IS_PROD
        ? res.redirect(`https://spectrum.chat/${community}/settings`)
        : res.redirect(`http://localhost:3000/${community}/settings`);
    });
});

slackRouter.get('/onboarding', (req, res) => {
  const code = req.query.code;
  const communityId = req.query.state;
  const senderId = req.user.id;
  const returnURI = IS_PROD
    ? `https://spectrum.chat/api/slack/onboarding`
    : `http://localhost:3001/api/slack/onboarding`;

  // generate an oauth token. This token will be used to communicate with the Slack API to get user information, and we'll store the token in the db record to allow for the user to access their Slack team info in the future.
  return generateOAuthToken(code, returnURI)
    .then(data => {
      if (!data) return new UserError('No token generated for this Slack team');
      const token = data.access_token;
      const teamName = data.team_name;
      const teamId = data.team_id;
      const input = {
        token,
        teamName,
        teamId,
        senderId,
        communityId,
      };
      return createSlackImportRecord(input);
    })
    .then(() => {
      // once the record has been created we can redirect the user back to Spectrum to finish the importing flow. To do this we'll get the community:
      return getCommunities([communityId]).then(data => data[0]);
    })
    .then(community => {
      return IS_PROD
        ? res.redirect(
            `https://spectrum.chat/new/community?s=2&id=${community.id}`
          )
        : res.redirect(
            `http://localhost:3000/new/community?s=2&id=${community.id}`
          );
    });
});

export default slackRouter;
