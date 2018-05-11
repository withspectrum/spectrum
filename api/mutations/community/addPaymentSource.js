// @flow
const debug = require('debug')('api:mutations:community:add-payment-source');
import type { GraphQLContext } from '../../';
import { insertOrReplaceStripeCustomer } from '../../models/stripeCustomers';
import UserError from '../../utils/UserError';
import { StripeUtil } from 'shared/stripe/utils';
import {
  isAuthedResolver as requireAuth,
  canAdministerCommunity,
} from '../../utils/permissions';

type Input = {
  input: {
    sourceId: string,
    communityId: string,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { sourceId, communityId } = args.input;
  const { user, loaders } = ctx;

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

  if (!await canAdministerCommunity(user.id, communityId, loaders)) {
    return new UserError(
      'You must own this community to manage payment sources'
    );
  }

  let changedSource;
  try {
    changedSource = await StripeUtil.attachNewSource({
      customerId: customer.id,
      sourceId: sourceId,
    });
  } catch (err) {
    return new UserError(err.message);
  }

  try {
    await StripeUtil.changeDefaultSource({
      customerId: customer.id,
      sourceId: sourceId,
    });
  } catch (err) {
    console.error('Could not update default payment method');
  }

  const newCustomer = await StripeUtil.getCustomer(changedSource.customer);

  // we only want to return from this mutation as soon as our db record
  // is in sync with stripe. Normally we defer this to webhooks, but since
  // this event needs updated data to respond to something the user is doing
  // *right now* we manually update the Stripe customer record in our db
  return await insertOrReplaceStripeCustomer(newCustomer)
    .then(() => community)
    .catch(err => {
      return new UserError('We had trouble saving your card', err.message);
    });
});
