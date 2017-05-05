// @flow
import { toggleReaction } from '../models/reaction';
import type { ReactionInput } from '../models/reaction';

type ToggleReactionType = {
  reaction: ReactionInput,
};

module.exports = {
  Mutation: {
    toggleReaction: (_: any, { reaction }: ToggleReactionType, { user }) =>
      toggleReaction(reaction, user.uid),
  },
};
