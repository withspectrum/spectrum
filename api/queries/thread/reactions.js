// @flow
import { hasReactedToThread } from 'api/models/threadReaction';
import type { DBThread } from 'shared/types';
import type { GraphQLContext } from '../../';

export default async (
  { id, reactionCount }: DBThread,
  _: any,
  { user, loaders }: GraphQLContext
) => ({
  count: reactionCount,
  hasReacted: user ? await hasReactedToThread(user.id, id) : false,
});
