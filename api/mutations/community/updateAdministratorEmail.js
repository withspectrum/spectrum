// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { setCommunityPendingAdministratorEmail } from '../../models/community';
import isEmail from 'validator/lib/isEmail';
import { sendAdministratorEmailValidationEmailQueue } from 'shared/bull/queues';

export default async (
  _: any,
  { input }: { input: { id: string, email: string } },
  { user, loaders }: GraphQLContext
) => {
  const currentUser = user;

  if (!currentUser) {
    return new UserError(
      "You must be signed in to update this community's administrator email"
    );
  }

  const { id, email } = input;

  if (!isEmail(email)) {
    return new UserError('Please enter a working email address');
  }

  const permissions = await loaders.userPermissionsInCommunity.load([
    currentUser.id,
    id,
  ]);

  if (!permissions || !permissions.isOwner)
    return new UserError('Only owners can change the community admin email.');

  return setCommunityPendingAdministratorEmail(id, email)
    .then(community => {
      sendAdministratorEmailValidationEmailQueue.add({
        email,
        userId: user.id,
        communityId: id,
        community,
      });
      return community;
    })
    .catch(
      () =>
        new UserError(
          "We weren't able to send a confirmation email. Please try again."
        )
    );
};
