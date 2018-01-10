// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';

export default (_: any, { id }: { id: string }, { user }: GraphQLContext) =>
  setUserLastSeenInDirectMessageThread(id, user.id);
