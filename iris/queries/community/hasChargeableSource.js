// @flow
import type { GraphQLContext } from '../..';
import type { DBCommunity } from 'shared/types';

export default async (
  { id, stripeCustomerId }: DBCommunity,
  _: any,
  { user, loaders }: GraphQLContext
) => {
  if (!stripeCustomerId) return false;

  const { isOwner } = await loaders.userPermissionsInCommunity.load([
    user.id,
    id,
  ]);

  if (!isOwner) return false;
  return loaders.stripeSources.load(stripeCustomerId).then(results => {
    const subs = results && results.reduction;
    if (!subs || subs.length === 0) return false;
    if (!Array.isArray(subs)) return subs.status === 'chargeable';

    return subs.some(sub => sub.status === 'chargeable');
  });
};
