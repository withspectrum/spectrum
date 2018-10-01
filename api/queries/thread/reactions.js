// @flow
import { hasReactedToThread } from 'api/models/threadReaction';
import type { DBThread } from 'shared/types';
import type { GraphQLContext } from '../../';

export default async (
  { id, reactionCount }: DBThread,
  _: any,
  { user, loaders }: GraphQLContext
) => ({
  count:
    typeof reactionCount === 'number'
      ? reactionCount
      : await loaders.threadReaction
          .load(id)
          .then(
            res =>
              res && Array.isArray(res.reduction) ? res.reduction.length : 0
          ),
  hasReacted: user ? await hasReactedToThread(user.id, id) : false,
});
