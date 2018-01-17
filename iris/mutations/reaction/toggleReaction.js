// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { toggleReaction } from '../../models/reaction';
import type { ReactionInput } from '../../models/reaction';

type ToggleReactionType = {
  reaction: ReactionInput,
};

export default (
  _: any,
  { reaction }: ToggleReactionType,
  { user }: GraphQLContext
) => {
  const currentUser = user;
  // user must be authed to send a message
  if (!currentUser)
    return new UserError('You must be signed in to add a reaction.');

  // all checks passed
  return toggleReaction(reaction, currentUser.id);
};
