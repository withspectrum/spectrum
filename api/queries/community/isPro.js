// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';

export default ({ id }: DBCommunity, _: any, { loaders }: GraphQLContext) => {
  return loaders.communityRecurringPayments.load(id).then(res => {
    const subs = res && res.reduction;
    if (!subs || subs.length === 0) return false;
    if (!Array.isArray(subs)) return subs.status === 'active';

    return subs.some(sub => sub.status === 'active');
  });
};
