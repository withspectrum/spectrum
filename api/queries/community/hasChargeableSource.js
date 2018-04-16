// @flow
import type { GraphQLContext } from '../..';
import type { DBCommunity } from 'shared/types';

export default async (
  { id, stripeCustomerId }: DBCommunity,
  _: any,
  { user, loaders }: GraphQLContext
) => {
  if (!stripeCustomerId || !user) return false;

  const {
    isOwner,
    isModerator,
  } = await loaders.userPermissionsInCommunity.load([user.id, id]);

  if (!isOwner && !isModerator) return null;
  return loaders.stripeCustomers.load(stripeCustomerId).then(results => {
    const customers = results && results.reduction;
    if (!customers || customers.length === 0) return false;
    const customerToEvaluate = customers[0];
    const sources = customerToEvaluate.sources.data;
    return sources.some(source => source.status === 'chargeable');
  });
};
