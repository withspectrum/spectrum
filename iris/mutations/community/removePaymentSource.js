// @flow
const debug = require('debug')(
  'iris:mutations:community:remove-payment-source'
);
import { replaceStripeCustomer } from '../../models/stripeCustomers';
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { StripeUtil } from 'shared/stripe/utils';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';

export default async (
  _: any,
  { input }: { input: { sourceId: string, communityId: string } },
  { user }: GraphQLContext
) => {
  const currentUser = user;

  if (!currentUser) {
    return new UserError('You must be signed in to manage this community');
  }

  const { sourceId, communityId } = input;

  const { customer, community } = await StripeUtil.jobPreflight(communityId);

  if (!community) {
    debug('Error getting community in preflight');
    return new UserError(
      'We had trouble processing this request - please try again later'
    );
  }

  if (!customer) {
    debug('Error creating customer in preflight');
    return new UserError(
      'We had trouble processing this request - please try again later'
    );
  }

  const currentUserCommunityPermissions = await getUserPermissionsInCommunity(
    communityId,
    currentUser.id
  );

  if (!currentUserCommunityPermissions.isOwner) {
    return new UserError(
      'You must own this community to manage payment sources'
    );
  }

  const detachSource = async () =>
    await StripeUtil.detachSource({
      customerId: customer.id,
      sourceId: sourceId,
    });

  return detachSource()
    .then(async () => await StripeUtil.getCustomer(customer.id))
    .then(
      async newCustomer =>
        console.log('newCustomer', newCustomer) ||
        (await replaceStripeCustomer(newCustomer.id, newCustomer))
    )
    .then(
      replacedCustomer =>
        console.log('replacedCustomer', replacedCustomer) || community
    )
    .catch(err => {
      return new UserError(`Error removing payment method: ${err.message}`);
    });
};
