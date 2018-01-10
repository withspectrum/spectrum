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
  return getUserPermissionsInCommunity(
    input.id,
    currentUser.id
  ).then(permissions => {
    if (!permissions.isOwner) {
      return new UserError(
        "You don't have permission to invite people to this community."
      );
    } else {
      return input.contacts
        .filter(user => user.email !== currentUser.email)
        .map(user => {
          return addQueue('community invite notification', {
            recipient: {
              email: user.email,
              firstName: user.firstName ? user.firstName : null,
              lastName: user.lastName ? user.lastName : null,
            },
            communityId: input.id,
            senderId: currentUser.id,
            customMessage: input.customMessage ? input.customMessage : null,
          });
        });
    }
  });
};
