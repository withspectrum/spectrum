// @flow
// $FlowFixMe
const { UserError } = require('graphql-errors');
import { toggleReaction } from '../models/reaction';
import type { ReactionInput } from '../models/reaction';

type ToggleReactionType = {
  reaction: ReactionInput,
};

module.exports = {
  Mutation: {
    toggleReaction: (_: any, { reaction }: ToggleReactionType, { user }) => {
      // user must be authed to send a message
      if (!user)
        return new UserError('You must be signed in to add a reaction.');

      // all checks passed
      return toggleReaction(reaction, user.uid);
    },
  },
};
