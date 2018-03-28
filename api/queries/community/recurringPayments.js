// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';

export default (
  { id }: DBCommunity,
  _: any,
  { user, loaders }: GraphQLContext
) => {
  const currentUser = user;

  if (!currentUser) {
    return new UserError('You must be signed in to continue.');
  }

  const queryRecurringPayments = async () => {
    const userPermissions = await loaders.userPermissionsInCommunity.load([
      currentUser.id,
      id,
    ]);
    if (!userPermissions.isOwner) return;

    const results = await loaders.communityRecurringPayments.load(id);
    const rPayments = results && results.reduction;

    const communitySubscriptions =
      rPayments &&
      rPayments.length > 0 &&
      rPayments.filter(obj => obj.planId === 'community-standard');

    if (!communitySubscriptions || communitySubscriptions.length === 0) return;
    return communitySubscriptions.map(subscription => ({
      amount: subscription.amount * subscription.quantity,
      createdAt: subscription.createdAt,
      plan: subscription.planName,
      status: subscription.status,
    }));
  };

  return queryRecurringPayments();
};
