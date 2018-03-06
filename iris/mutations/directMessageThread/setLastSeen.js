// @flow
import type { GraphQLContext } from '../../';
import { setUserLastSeenInDirectMessageThread } from '../../models/usersDirectMessageThreads';

export default (
  _: any,
  { id }: { id: string },
  { user, loaders }: GraphQLContext
) =>
  setUserLastSeenInDirectMessageThread(id, user.id).then(result => {
    loaders.directMessageThread.clear(id);
    return result;
  });
