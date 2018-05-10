// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { deleteUser } from '../../models/user';
import { removeUsersCommunityMemberships } from '../../models/usersCommunities';
import { removeUsersChannelMemberships } from '../../models/usersChannels';
import { disableAllThreadNotificationsForUser } from '../../models/usersThreads';
import { getUserRecurringPayments } from '../../models/recurringPayment';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

export default requireAuth(async (_: any, __: any, ctx: GraphQLContext) => {
  const { user } = ctx;

  const rPayments = await getUserRecurringPayments(user.id);
  const isPro = rPayments && rPayments.some(pmt => pmt.planId === 'beta-pro');

  if (isPro) {
    return new UserError(
      'Please downgrade from Pro before deleting your account'
    );
  }

  return Promise.all([
    deleteUser(user.id),
    removeUsersCommunityMemberships(user.id),
    removeUsersChannelMemberships(user.id),
    disableAllThreadNotificationsForUser(user.id),
  ])
    .then(() => true)
    .catch(err => new UserError(err.message));
});
