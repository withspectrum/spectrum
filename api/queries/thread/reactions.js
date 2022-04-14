// @flow
import { hasReactedToThread } from 'api/models/threadReaction';
import Raven from 'shared/raven';
import type { DBThread } from 'shared/types';
import type { GraphQLContext } from '../../';

export default async (root: DBThread, _: any, ctx: GraphQLContext) => {
  const { user, loaders } = ctx;
  const { id, reactionCount } = root;

  const getReactionCount = async () => {
    if (typeof reactionCount === 'number') return reactionCount;

    Raven.captureException(
      new Error(
        `Thread with ID "${id}" does not have denormalized reactionCount.`
      )
    );

    return await loaders.threadReaction.load(id).then(res => {
      if (res && Array.isArray(res.reduction)) {
        return res.reduction.length;
      }

      return 0;
    });
  };

  const hasReacted = user ? await hasReactedToThread(user.id, id) : false;
  const count = await getReactionCount();

  return {
    hasReacted,
    count,
  };
};
