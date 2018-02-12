// @flow
/*

    DEPRECATED 2/8/2018 by @brian

*/
import type { GraphQLContext } from '../../';
import type { DBThread } from 'shared/types';

export default ({ creatorId }: DBThread, _: any, { user }: GraphQLContext) => {
  if (!creatorId || !user) return false;
  return user.id === creatorId;
};
