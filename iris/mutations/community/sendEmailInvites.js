// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { isEmail } from 'validator';
import { sendCommunityInviteNotificationQueue } from 'shared/bull/queues';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';

type Contact = {
  email: string,
  firstName?: ?string,
  lastName?: ?string,
};

type SendEmailInvitesInput = {
  input: {
    id: string,
    contacts: Array<Contact>,
    customMessage?: ?string,
  },
};

export default async (
  _: any,
  { input }: SendEmailInvitesInput,
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
  } else {
    return input.contacts
      .filter(user => user.email !== currentUser.email)
      .filter(user => user && user.email && isEmail(user.email))
      .map(user => {
        return sendCommunityInviteNotificationQueue.add({
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
};
