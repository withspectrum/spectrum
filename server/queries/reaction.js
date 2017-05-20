// @flow

import { getReaction } from '../models/reaction';
import { getMessage } from '../models/message';
import type { GraphQLContext } from '../';

type Root = {
  id: string,
  userId: string,
  messageId: string,
};

type QueryArgs = {
  id: string,
};

const reaction = {
  Query: {
    reaction: (_: Root, { id }: QueryArgs) => getReaction(id),
  },
  Reaction: {
    user: ({ userId }: Root, _: any, { loaders }: GraphQLContext) =>
      loaders.user.load(userId),
    message: ({ messageId }: Root) => getMessage(messageId),
  },
};

module.exports = reaction;
