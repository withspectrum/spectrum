// @flow
import type { GraphQLContext } from '../../';
import { addThreadReaction } from '../../models/reaction';
import { getThreadById } from '../../models/thread';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

type Input = {
  input: {
    threadId: string,
    type: 'like',
  },
};

export default requireAuth(
  async (_: any, args: Input, { user, loaders }: GraphQLContext) => {
    return await addThreadReaction(args.input, user.id).then(
      async () => await getThreadById(args.input.threadId)
    );
  }
);
