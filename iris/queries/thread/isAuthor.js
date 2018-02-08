// @flow
import type { GraphQLContext } from '../../';
import type { DBThread } from 'shared/types';

export default ({ creatorId }: DBThread, _: any, { user }: GraphQLContext) => {
  if (!creatorId || !user) return false;
  return user.id === creatorId;
};
