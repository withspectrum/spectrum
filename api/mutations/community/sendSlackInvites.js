// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import { markInitialSlackInvitationsSent } from '../../models/communitySettings';
import { getCommunityById } from '../../models/community';
import { sendSlackInvitationsQueue } from 'shared/bull/queues';

type SendSlackInvitesInput = {
  input: {
    id: string,
    customMessage?: ?string,
  },
};

export default async (
  _: any,
  { input }: SendSlackInvitesInput,
  { user, loaders }: GraphQLContext
) => {
  const currentUser = user;

  if (!currentUser) {
    return new UserError(
      'You must be signed in to invite people to this community.'
    );
  }

  // make sure the user is the owner of the community
  const permissions = await getUserPermissionsInCommunity(
    input.id,
    currentUser.id
  );

  if (!permissions.isOwner && !permissions.isModerator) {
    return new UserError(
      "You don't have permission to invite a Slack team to this community."
    );
  }

  const settings = await loaders.communitySettings.load(input.id);

  if (!settings || !settings.slackSettings || !settings.slackSettings.scope) {
    return new UserError(
      'No Slack team is connected to this community. Try reconnecting.'
    );
  }

  if (settings && settings.slackSettings.invitesSentAt) {
    return new UserError(
      'This Slack team has already been invited to join your community!'
    );
  }

  return await markInitialSlackInvitationsSent(
    input.id,
    input.customMessage
  ).then(async () => {
    loaders.communitySettings.clear(input.id);
    sendSlackInvitationsQueue.add({
      communityId: input.id,
      userId: currentUser.id,
    });
    return await getCommunityById(input.id);
  });
};
