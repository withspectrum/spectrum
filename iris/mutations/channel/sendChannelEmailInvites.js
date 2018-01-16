// @flow
import type { GraphQLContext } from '../../';
import { getUserPermissionsInChannel } from '../../models/usersChannels';
import { addQueue } from '../../utils/workerQueue';
import UserError from '../../utils/UserError';

type Contact = {
  email: string,
  firstName: string,
  lastName: string,
};

type EmailInvitesInput = {
  customMessage: ?string,
  contacts: Array<Contact>,
  id: string,
};

export default async (
  _: any,
  { input }: { input: EmailInvitesInput },
  { user }: GraphQLContext
) => {
  const currentUser = user;

  if (!currentUser) {
    return new UserError(
      'You must be signed in to invite people to this channel.'
    );
  }

  // make sure the user is the owner of the channel
  const permissions = await getUserPermissionsInChannel(
    input.id,
    currentUser.id
  );

  if (!permissions.isOwner) {
    return new UserError(
      "You don't have permission to invite people to this channel."
    );
  }

  return (
    input.contacts
      // can't invite yourself
      .filter(contact => contact.email !== currentUser.email)
      .map(contact => {
        return addQueue('private channel invite notification', {
          recipient: {
            email: contact.email,
            firstName: contact.firstName ? contact.firstName : null,
            lastName: contact.lastName ? contact.lastName : null,
          },
          channelId: input.id,
          senderId: currentUser.id,
          customMessage: input.customMessage ? input.customMessage : null,
        });
      })
  );
};
