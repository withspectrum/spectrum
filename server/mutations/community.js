// @flow
import {
  createCommunity,
  editCommunity,
  deleteCommunity,
  getCommunities,
} from '../models/community';
import type {
  CreateCommunityArguments,
  EditCommunityArguments,
} from '../models/community';

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
    deleteCommunity: (_: any, { id }, { user }: Context) => {
      return getCommunities([id]).then(communities => {
        if (communities[0].owners.indexOf(user.uid) > -1) {
          return deleteCommunity(id);
        }

        return new Error('Not allowed to do that!');
      });
    },
    editCommunity: (
      _: any,
      args: EditCommunityArguments,
      { user }: Context
    ) => {
      return getCommunities([args.input.id]).then(communities => {
        if (communities[0].owners.indexOf(user.uid) > -1) {
          return editCommunity(args);
        }

        return new Error('Not allowed to do that!');
      });
    },
  },
};
