// @flow
import type { GraphQLContext } from '../../';
import { setUserLastSeenInDirectMessageThread } from '../../models/usersDirectMessageThreads';

export default (_: any, { id }: { id: string }, { user }: GraphQLContext) =>
  setUserLastSeenInDirectMessageThread(id, user.id);
