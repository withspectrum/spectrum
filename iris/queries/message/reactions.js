// @flow
import type { DBMessage } from 'shared/types';
import type { GraphQLContext } from '../../';

export default ({ id }: DBMessage, _: any, { user, loaders }: GraphQLContext) =>
  loaders.messageReaction.load(id).then(result => {
    if (!result)
      return {
        count: 0,
        hasReacted: false,
      };
    const reactions = result.reduction;
    return {
      count: reactions.length,
      hasReacted: user
        ? reactions.some(reaction => reaction.userId === user.id)
        : false,
    };
  });
