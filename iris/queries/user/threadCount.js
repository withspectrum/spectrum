// @flow
import type { GraphQLContext } from '../../';
import type { DBUser } from 'shared/types';

export default ({ id }: DBUser, _: any, { loaders }: GraphQLContext) => {
  return loaders.userThreadCount.load(id).then(data => (data ? data.count : 0));
};
