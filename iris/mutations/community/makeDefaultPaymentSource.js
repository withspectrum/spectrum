// @flow
const debug = require('debug')(
  'iris:mutations:community:change-default-payment-source'
);
import { replaceStripeCustomer } from '../../models/stripeCustomers';
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { StripeUtil } from 'shared/stripe/utils';

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

  const changeDefaultSource = async () =>
    await StripeUtil.changeDefaultSource({
      customerId: customer.id,
      sourceId: sourceId,
    });

  return changeDefaultSource()
    .then(async () => await StripeUtil.getCustomer(customer.id))
    .then(
      async newCustomer =>
        await replaceStripeCustomer(newCustomer.id, newCustomer)
    )
    .then(() => community)
    .catch(err => {
      return new UserError('Error changing default method: ', err.message);
    });
};
