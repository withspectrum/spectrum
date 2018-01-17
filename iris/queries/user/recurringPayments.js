// @flow
import type { GraphQLContext } from '../../';
import type { DBUser } from 'shared/types';
import UserError from '../../utils/UserError';

export default ({ id }: DBUser, __: any, { user, loaders }: GraphQLContext) => {
  if (!user) {
    return new UserError('You must be signed in to continue.');
  }
  if (id !== user.id) {
    throw new UserError('You can only see your own recurring payments.');
  }

  return loaders.userRecurringPayments.load(user.id).then(result => {
    const subs = result && result.reduction;
    const userProSubs =
      subs && subs.length > 0 && subs.filter(obj => obj.planId === 'beta-pro');
    if (!userProSubs || userProSubs.length === 0) {
      return [];
    } else {
      return userProSubs.map(subscription => {
        return {
          amount: subscription.amount,
          createdAt: subscription.createdAt,
          plan: subscription.planName,
          status: subscription.status,
        };
      });
    }
  });
};
