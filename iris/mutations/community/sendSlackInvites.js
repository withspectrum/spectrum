// @flow
import { isEmail } from 'validator';
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import {
  getSlackImport,
  markSlackImportAsSent,
} from '../../models/slackImport';
import { getCommunityById } from '../../models/community';
import {
  _adminProcessSlackImportQueue,
  sendCommunityInviteNotificationQueue,
} from 'shared/bull/queues';
import { getUserById } from '../../models/user';

type SendSlackInvitesInput = {
  input: {
    id: string,
    customMessage?: ?string,
  },
};

export default async (
  _: any,
  { input }: SendSlackInvitesInput,
  { user }: GraphQLContext
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

  if (!permissions.isOwner) {
    return new UserError(
      "You don't have permission to invite people to this community."
    );
  }

  // get the slack import to make sure it hasn't already been sent before
  const result = await getSlackImport(input.id);

  // if no slack import exists
  if (!result) {
    return new UserError(
      'No Slack team is connected to this community. Try reconnecting.'
    );
  }
  // if the slack import was already sent
  if (result.sent && result.sent !== null) {
    return new UserError(
      'This Slack team has already been invited to join your community!'
    );
  }

  // mark the slack import for this community as sent
  const inviteRecord = await markSlackImportAsSent(input.id);

  if (inviteRecord.members.length === 0) {
    return new UserError('This Slack team has no members to invite!');
  }

  // for each member on the invite record, send a community invitation

  inviteRecord.members
    .filter(user => user && user.email && isEmail(user.email))
    .filter(user => user.email !== currentUser.email)
    .map(user => {
      return sendCommunityInviteNotificationQueue.add({
        recipient: {
          email: user.email,
          firstName: user.firstName ? user.firstName : null,
          lastName: user.lastName ? user.lastName : null,
        },
        communityId: inviteRecord.communityId,
        senderId: inviteRecord.senderId,
        customMessage: input.customMessage,
      });
    });

  // send the community record back to the client
  const [{ members, teamName }, community, thisUser] = await Promise.all([
    getSlackImport(input.id),
    getCommunityById(input.id),
    getUserById(currentUser.id),
  ]);

  const invitedCount = members
    .filter(user => !!user.email)
    .filter(user => user.email !== thisUser.email).length;

  _adminProcessSlackImportQueue.add({
    thisUser,
    community,
    invitedCount,
    teamName,
  });

  return community;
};
