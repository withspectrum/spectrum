// @flow
import { hasReactedToThread } from 'api/models/threadReaction';
import type { DBThread } from 'shared/types';
import type { GraphQLContext } from '../../';

export default async (
  { id, reactionCount }: DBThread,
  _: any,
  { user, loaders }: GraphQLContext
) => {
  const hasReacted = user ? await hasReactedToThread(user.id, id) : false;
  if (typeof reactionCount === 'number') {
    return {
      count: reactionCount,
      hasReacted,
    };
  }

  // Fallback if there's no denormalized reactionCount, also report to Sentry
  Raven.captureException(
    new Error(
      `Thread with ID "${id}" does not have denormalized reactionCount.`
    )
  );
  return {
    count: await loaders.threadReaction
      .load(id)
      .then(
        res => (res && Array.isArray(res.reduction) ? res.reduction.length : 0)
      ),
    hasReacted,
  };
};
