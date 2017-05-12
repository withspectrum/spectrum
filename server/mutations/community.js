// @flow
import {
  createCommunity,
  editCommunity,
  deleteCommunity,
  getCommunities,
  joinCommunity,
  leaveCommunity,
  subscribeToDefaultFrequencies,
  unsubscribeFromAllFrequenciesInCommunity,
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
        const community = communities[0];

        if (!community) {
          return new Error("This community doesn't exist.");
        }

        if (community.owners.indexOf(user.uid) > -1) {
          return deleteCommunity(id);
        }

        return new Error("You don't have permission to delete this community.");
      });
    },
    editCommunity: (
      _: any,
      args: EditCommunityArguments,
      { user }: Context
    ) => {
      return getCommunities([args.input.id]).then(communities => {
        const community = communities[0];
        if (!community) {
          return new Error("This community doesn't exist.");
        }

        if (community.owners.indexOf(user.uid) > -1) {
          return editCommunity(args);
        }

        return new Error("You don't have permission to edit this community.");
      });
    },
    toggleCommunityMembership: (_: any, { id }: string, { user }: Context) => {
      return getCommunities([id]).then(communities => {
        const community = communities[0];

        if (!community) {
          return new Error("This community doesn't exist.");
        }

        // if the person owns the community, they have accidentally triggered
        // a join or leave action, which isn't allowed
        if (community.owners.indexOf(user.uid) > -1) {
          return new Error(
            "Owners of a community can't join or leave their own community."
          );
        }

        if (community.members.indexOf(user.uid) > -1) {
          return leaveCommunity(id, user.uid)
            .then(community => {
              return Promise.all([
                community,
                unsubscribeFromAllFrequenciesInCommunity(id, user.uid),
              ]);
            })
            .then(data => data[0]);
        } else {
          return (
            joinCommunity(id, user.uid)
              .then(community => {
                return Promise.all([
                  community,
                  subscribeToDefaultFrequencies(id, user.uid),
                ]);
              })
              //return only the community
              //TODO: also return the frequency for the client side store update
              .then(data => data[0])
          );
        }
      });
    },
  },
};
