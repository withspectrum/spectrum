// @flow
import { Router } from 'express';
import UserError from '../../utils/UserError';
import { generateOAuthToken } from '../../models/slackImport';
import { updateSlackSettingsAfterConnection } from '../../models/communitySettings';

const IS_PROD = process.env.NODE_ENV === 'production';

const slackRouter = Router();

// TODO: Figure out how to type this properly
slackRouter.get('/', (req: any, res: any) => {
  const code = req.query.code;
  const communityId = req.query.state;
  const connectedBy = req.user.id;
  const clientUrl = req.query.clientUrl;
  const returnURI = IS_PROD
    ? clientUrl.indexOf('alpha') >= 0
      ? 'https://alpha.spectrum.chat/api/slack'
      : 'https://spectrum.chat/api/slack'
    : 'http://localhost:3001/api/slack';

  // generate an oauth token. This token will be used to communicate with the Slack API to get user information, and we'll store the token in the db record to allow for the user to access their Slack team info in the future.
  return generateOAuthToken(code, returnURI)
    .then(data => {
      if (!data) return new UserError('No token generated for this Slack team');
      const token = data.access_token;
      const teamName = data.team_name;
      const teamId = data.team_id;
      const scope = data.scope;
      const input = {
        token,
        teamName,
        teamId,
        connectedBy,
        scope,
      };
      return updateSlackSettingsAfterConnection(communityId, input);
    })
    .then(community => community.slug)
    .then(slug => {
      return IS_PROD
        ? clientUrl.indexOf('alpha') >= 0
          ? res.redirect(`https://alpha.spectrum.chat/${slug}/settings`)
          : res.redirect(`https://spectrum.chat/${slug}/settings`)
        : res.redirect(`http://localhost:3000/${slug}/settings`);
    });
});

// TODO: Figure out how to type this properly
slackRouter.get('/onboarding', (req: any, res: any) => {
  const code = req.query.code;
  const communityId = req.query.state;
  const connectedBy = req.user.id;
  const clientUrl = req.query.clientUrl;
  const returnURI = IS_PROD
    ? clientUrl.indexOf('alpha') >= 0
      ? 'https://alpha.spectrum.chat/api/slack/onboarding'
      : 'https://spectrum.chat/api/slack/onboarding'
    : 'http://localhost:3001/api/slack/onboarding';

  // generate an oauth token. This token will be used to communicate with the Slack API to get user information, and we'll store the token in the db record to allow for the user to access their Slack team info in the future.
  return generateOAuthToken(code, returnURI)
    .then(data => {
      if (!data) return new UserError('No token generated for this Slack team');
      const token = data.access_token;
      const teamName = data.team_name;
      const teamId = data.team_id;
      const scope = data.scope;
      const input = {
        token,
        teamName,
        teamId,
        connectedBy,
        scope,
      };
      return updateSlackSettingsAfterConnection(communityId, input);
    })
    .then(community => community.id)
    .then(id => {
      return IS_PROD
        ? clientUrl.indexOf('alpha') >= 0
          ? res.redirect(
              `https://alpha.spectrum.chat/new/community?s=2&id=${id}`
            )
          : res.redirect(`https://spectrum.chat/new/community?s=2&id=${id}`)
        : res.redirect(`http://localhost:3000/new/community?s=2&id=${id}`);
    });
});

export default slackRouter;
