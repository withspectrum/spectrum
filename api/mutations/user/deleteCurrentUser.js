// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { deleteUser } from '../../models/user';
import { removeUsersCommunityMemberships } from '../../models/usersCommunities';
import { removeUsersChannelMemberships } from '../../models/usersChannels';
import { disableAllThreadNotificationsForUser } from '../../models/usersThreads';
import { getUserRecurringPayments } from '../../models/recurringPayment';

export default async (_: any, __: any, { user }: GraphQLContext) => {
  const currentUser = user;
  if (!currentUser) {
    return new UserError('You must be signed in to delete your account');
  }

  const rPayments = await getUserRecurringPayments(currentUser.id);
  const isPro = rPayments && rPayments.some(pmt => pmt.planId === 'beta-pro');

  if (isPro) {
    return new UserError(
      'Please downgrade from Pro before deleting your account'
    );
  }

  return Promise.all([
    deleteUser(currentUser.id),
    removeUsersCommunityMemberships(currentUser.id),
    removeUsersChannelMemberships(currentUser.id),
    disableAllThreadNotificationsForUser(currentUser.id),
  ])
    .then(() => true)
    .catch(err => new UserError(err.message));
};
