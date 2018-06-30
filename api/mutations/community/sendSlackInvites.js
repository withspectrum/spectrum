// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { markInitialSlackInvitationsSent } from '../../models/communitySettings';
import { getCommunityById } from '../../models/community';
import { sendSlackInvitationsQueue } from 'shared/bull/queues';
import {
  isAuthedResolver as requireAuth,
  canModerateCommunity,
} from '../../utils/permissions';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';

type Input = {
  input: {
    id: string,
    customMessage?: ?string,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { id: communityId, customMessage } = args.input;
  const { user, loaders } = ctx;

  if (!await canModerateCommunity(user.id, communityId, loaders)) {
    trackQueue.add({
      userId: user.id,
      event: events.COMMUNITY_SLACK_TEAM_INVITES_SENT_FAILED,
      context: { communityId },
      properties: {
        reason: 'no permission',
      },
    });

    return new UserError(
      "You don't have permission to invite a Slack team to this community."
    );
  }

  const settings = await loaders.communitySettings.load(communityId);

  if (!settings || !settings.slackSettings || !settings.slackSettings.scope) {
    trackQueue.add({
      userId: user.id,
      event: events.COMMUNITY_SLACK_TEAM_INVITES_SENT_FAILED,
      context: { communityId },
      properties: {
        reason: 'no slack team connected',
      },
    });

    return new UserError(
      'No Slack team is connected to this community. Try reconnecting.'
    );
  }

  if (settings && settings.slackSettings.invitesSentAt) {
    trackQueue.add({
      userId: user.id,
      event: events.COMMUNITY_SLACK_TEAM_INVITES_SENT_FAILED,
      context: { communityId },
      properties: {
        reason: 'slack team already invited',
      },
    });

    return new UserError(
      'This Slack team has already been invited to join your community!'
    );
  }

  return await markInitialSlackInvitationsSent(
    communityId,
    customMessage,
    user.id
  ).then(async () => {
    loaders.communitySettings.clear(communityId);
    sendSlackInvitationsQueue.add({
      communityId,
      userId: user.id,
    });
    return await getCommunityById(communityId);
  });
});
