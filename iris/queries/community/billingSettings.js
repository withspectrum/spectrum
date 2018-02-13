// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';

export default (
  {
    id,
    stripeCustomerId,
    administratorEmail,
    pendingAdministratorEmail,
  }: DBCommunity,
  _: any,
  { user, loaders }: GraphQLContext
) => {
  if (!id || !user) return {};
  return loaders.userPermissionsInCommunity.load([user.id, id]).then(result => {
    if (result && result.isOwner)
      return {
        stripeCustomerId,
        administratorEmail,
        pendingAdministratorEmail,
      };
    return null;
  });
};
