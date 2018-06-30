// @flow
const debug = require('debug')('api:queries:community:has-features');
import type { GraphQLContext } from '../..';
import type { DBCommunity } from 'shared/types';
import { StripeUtil } from 'shared/stripe/utils';
import { COMMUNITY_ANALYTICS } from 'pluto/queues/constants';

export default async (
  { id }: DBCommunity,
  _: any,
  { user }: GraphQLContext
) => {
  const defaultFeatures = {
    analytics: false,
    prioritySupport: false,
  };

  const currentUser = user;

  if (!currentUser) {
    return defaultFeatures;
  }

  const { customer, community } = await StripeUtil.jobPreflight(id);

  if (!community) {
    debug('Error getting community in preflight');
    return defaultFeatures;
  }

  if (!customer) {
    debug('Error creating customer in preflight');
    return defaultFeatures;
  }

  const hasAnalytics = await StripeUtil.hasSubscriptionItemOfType(
    customer,
    COMMUNITY_ANALYTICS
  );
  const hasPrioritySupport = await StripeUtil.hasSubscriptionItemOfType(
    customer,
    'priority-support'
  );

  return {
    analytics: hasAnalytics,
    prioritySupport: hasPrioritySupport,
  };
};
