// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';

type Features = {
  analytics: boolean,
  privateChannels: boolean,
};

type FeatureMap = {
  [plan: string]: Features,
};

const FEATURE_MAP: FeatureMap = {
  'community-standard': {
    analytics: true,
    privateChannels: true,
  },
  'community-project': {
    analytics: false,
    privateChannels: true,
  },
  default: {
    analytics: false,
    privateChannels: false,
  },
};

export default (
  { id }: DBCommunity,
  _: any,
  { loaders }: GraphQLContext
): Promise<Features> => {
  return loaders.communityRecurringPayments.load(id).then(res => {
    let subs = res && res.reduction;
    if (!subs || subs.length === 0) return FEATURE_MAP.default;

    // Convert non-array to array to avoid code duplication below
    if (!Array.isArray(subs)) subs = [subs];

    // No active subscription? Can't have any features then.
    if (subs.every(sub => sub.status !== 'active')) return FEATURE_MAP.default;

    // A community-standard subscription?
    if (subs.find(sub => sub.planId === 'community-standard'))
      return FEATURE_MAP['community-standard'];

    // A community-project subscription?
    if (subs.find(sub => sub.planId === 'community-project'))
      return FEATURE_MAP['community-project'];

    return FEATURE_MAP.default;
  });
};
