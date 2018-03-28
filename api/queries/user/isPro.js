// @flow
import type { GraphQLContext } from '../../';
import type { DBUser } from 'shared/types';

export default ({ id }: DBUser, _: any, { loaders }: GraphQLContext) => {
  return loaders.userRecurringPayments.load(id).then(result => {
    if (!result || result.length === 0) return false;
    const subs = result.reduction;

    return subs.some(
      sub => sub.status === 'active' && sub.planId === 'beta-pro'
    );
  });
};
