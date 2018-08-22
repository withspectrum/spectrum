// @flow
import type { GraphQLContext } from '../../';
import { removeThreadReaction } from '../../models/threadReaction';
import { getThreadById } from '../../models/thread';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';
import { calculateThreadScoreQueue } from 'shared/bull/queues';

type Input = {
  input: {
    threadId: string,
  },
};

export default requireAuth(
  async (_: any, args: Input, { user, loaders }: GraphQLContext) => {
    return await removeThreadReaction(args.input.threadId, user.id).then(() => {
      calculateThreadScoreQueue.add(
        {
          threadId: args.input.threadId,
        },
        {
          jobId: args.input.threadId,
        }
      );
      return getThreadById(args.input.threadId);
    });
  }
);
