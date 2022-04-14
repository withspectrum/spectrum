// @flow
import type { GraphQLContext } from '../../';
import type { DBUser } from 'shared/types';

export default ({ id }: DBUser, _: any, { loaders }: GraphQLContext) => {
  if (!id) return 0;
  return loaders.userTotalReputation
    .load(id)
    .then(data => (data ? data.reputation : 0));
};
