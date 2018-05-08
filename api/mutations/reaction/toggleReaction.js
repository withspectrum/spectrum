// @flow
import type { GraphQLContext } from '../../';
import { toggleReaction } from '../../models/reaction';
import type { ReactionInput } from '../../models/reaction';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

type ToggleReactionType = {
  reaction: ReactionInput,
};

export default requireAuth(
  async (_: any, { reaction }: ToggleReactionType, { user }: GraphQLContext) =>
    await toggleReaction(reaction, user.id)
);
