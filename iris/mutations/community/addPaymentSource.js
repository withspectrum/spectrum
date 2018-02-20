// @flow
const debug = require('debug')('iris:mutations:community:add-payment-source');
import type { GraphQLContext } from '../../';
import { replaceStripeCustomer } from '../../models/stripeCustomers';
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

  const changedSource = await StripeUtil.attachNewSource({
    customerId: customer.id,
    sourceId: sourceId,
  });

  const newCustomer = await StripeUtil.getCustomer(changedSource.customer);

  // we only want to return from this mutation as soon as our db record
  // is in sync with stripe. Normally we defer this to webhooks, but since
  // this event needs updated data to respond to something the user is doing
  // *right now* we manually update the Stripe customer record in our db
  return await replaceStripeCustomer(newCustomer)
    .then(() => community)
    .catch(err => {
      return new UserError('We had trouble saving your card', err.message);
    });
};
