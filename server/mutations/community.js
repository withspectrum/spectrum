// @flow
import { createCommunity } from '../models/community';
import type { CreateCommunityArguments } from '../models/community';

type Context = {
  user: Object,
};

module.exports = {
  Mutation: {
    createCommunity: (
      _: any,
      args: CreateCommunityArguments,
      { user }: Context
    ) => createCommunity(args, user.uid),
  },
};
