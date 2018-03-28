// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';

export default (
  { id }: DBCommunity,
  _: any,
  { user, loaders }: GraphQLContext
) => {
  if (!id || !user) return {};
  return loaders.userPermissionsInCommunity
    .load([user.id, id])
    .then(result => (result ? result : {}));
};
