// @flow
import {
  createCommunity,
  editCommunity,
  deleteCommunity,
  getCommunities,
  joinCommunity,
  leaveCommunity,
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
    toggleCommunityMembership: (_: any, { id }: string, { user }: Context) => {
      return getCommunities([id]).then(communities => {
        if (!communities[0]) {
          // todo handle error if community doesn't exist
          return;
        }

        if (communities[0].members.indexOf(user.uid) > -1) {
          return leaveCommunity(id, user.uid);
        } else {
          return joinCommunity(id, user.uid);
        }
      });
    },
  },
};
