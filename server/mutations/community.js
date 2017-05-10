// @flow
import {
  createCommunity,
  editCommunity,
  deleteCommunity,
} from '../models/community';
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
    deleteCommunity: (_: any, { id }) => deleteCommunity(id), //TODO: Add permission checks here
    editCommunity: (
      _: any,
      args: CreateCommunityArguments,
      { user }: Context
    ) => editCommunity(args, user.uid),
  },
};
