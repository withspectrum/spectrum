// @flow
import type { GraphQLContext } from '../../';
import { addThreadReaction } from '../../models/threadReaction';
import { getThreadById } from '../../models/thread';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';
import { calculateThreadScoreQueue } from 'shared/bull/queues';

type Input = {
  input: {
    threadId: string,
    type: 'like',
  },
};

export default requireAuth(
  async (_: any, args: Input, { user, loaders }: GraphQLContext) => {
    return await addThreadReaction(args.input, user.id).then(() => {
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
