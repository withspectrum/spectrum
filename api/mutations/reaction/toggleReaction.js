// @flow
import type { GraphQLContext } from '../../';
import { toggleReaction } from '../../models/reaction';
import type { ReactionInput } from '../../models/reaction';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

type Input = {
  reaction: ReactionInput,
};

export default requireAuth(
  async (_: any, { reaction }: Input, { user, loaders }: GraphQLContext) => {
    return await toggleReaction(reaction, user.id);
  }
);
