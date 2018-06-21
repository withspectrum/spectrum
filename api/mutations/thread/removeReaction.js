// @flow
import type { GraphQLContext } from '../../';
import { removeThreadReaction } from '../../models/reaction';
import { getThreadById } from '../../models/thread';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

type Input = {
  input: {
    threadId: string,
  },
};

export default requireAuth(
  async (_: any, args: Input, { user, loaders }: GraphQLContext) => {
    return await removeThreadReaction(args.input.threadId, user.id).then(
      async () => await getThreadById(args.input.threadId)
    );
  }
);
