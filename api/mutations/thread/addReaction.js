// @flow
import type { GraphQLContext } from '../../';
import { addThreadReaction } from '../../models/reaction';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

type Input = {
  input: {
    threadId: string,
    type: 'like',
  },
};

export default requireAuth(
  async (_: any, args: Input, { user, loaders }: GraphQLContext) => {
    return await addThreadReaction(args.input, user.id);
  }
);
