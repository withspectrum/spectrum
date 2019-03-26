// @flow
import { calculateThreadScoreQueue } from 'shared/bull/queues';
import type { GraphQLContext } from '../../';
import { canViewThread } from '../../utils/permissions';

export default async (
  _: any,
  { id }: { id: string },
  { loaders, user }: GraphQLContext
) => {
  if (!(await canViewThread(user ? user.id : 'undefined', id, loaders))) {
    return null;
  }

  const thread = await loaders.thread.load(id);

  if (!thread) return null;
  // If the threads score hasn't been updated in the past
  // 24 hours add a new job to the queue to update it
  if (
    (!thread.score && !thread.scoreUpdatedAt) ||
    (thread.scoreUpdatedAt &&
      Date.now() > new Date(thread.scoreUpdatedAt).getTime() + 86400000)
  ) {
    calculateThreadScoreQueue.add(
      { threadId: thread.id },
      { jobId: thread.id }
    );
  }

  return thread;
};
