// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';

export default (_, { input }, { user }) => {
  const currentUser = user;

  if (!currentUser) {
    return new UserError(
      'You must be signed in to invite people to this community.'
    );
  }

  // make sure the user is the owner of the community
  return (
    getUserPermissionsInCommunity(input.id, currentUser.id)
      .then(permissions => {
        if (!permissions.isOwner) {
          return new UserError(
            "You don't have permission to invite people to this community."
          );
        }

        // get the slack import to make sure it hasn't already been sent before
        return getSlackImport(input.id);
      })
      .then(result => {
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
        return markSlackImportAsSent(input.id);
      })
      .then(inviteRecord => {
        if (inviteRecord.members.length === 0) {
          return new UserError('This Slack team has no members to invite!');
        }

        // for each member on the invite record, send a community invitation
        return inviteRecord.members
          .filter(user => !!user.email)
          .filter(user => user.email !== currentUser.email)
          .map(user => {
            return addQueue('community invite notification', {
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
      })
      // send the community record back to the client
      .then(async () => {
        const [{ members, teamName }, community, user] = await Promise.all([
          getSlackImport(input.id),
          getCommunityById(input.id),
          getUserById(currentUser.id),
        ]);

        const invitedCount = members
          .filter(user => !!user.email)
          .filter(user => user.email !== currentUser.email).length;

        addQueue('admin slack import processed email', {
          user,
          community,
          invitedCount,
          teamName,
        });

        return community;
      })
  );
};
