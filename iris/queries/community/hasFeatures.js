// @flow
const debug = require('debug')('iris:queries:community:has-features');
import type { GraphQLContext } from '../..';
import type { DBCommunity } from 'shared/types';
import UserError from '../../utils/UserError';
import { StripeUtil } from 'shared/stripe/utils';

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
    'community-analytics'
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
