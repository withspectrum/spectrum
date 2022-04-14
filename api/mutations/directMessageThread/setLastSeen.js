// @flow
import type { GraphQLContext } from '../../';
import { setUserLastSeenInDirectMessageThread } from '../../models/usersDirectMessageThreads';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

type Input = {
  id: string,
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { id } = args;
  const { user } = ctx;

  return setUserLastSeenInDirectMessageThread(id, user.id);
});
