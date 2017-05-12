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
    ) => {
      // user must be authed to create a community
      if (!user)
        return new Error('You must be signed in to create a new community.');

      // all checks passed
      return createCommunity(args, user.uid);
    },
    deleteCommunity: (_: any, { id }, { user }: Context) => {
      // user must be authed to delete a community
      if (!user)
        return new Error(
          'You must be signed in to make changes to this community.'
        );

      // get the community being deleted
      return getCommunities([id]).then(communities => {
        // select the community returned
        const community = communities[0];

        // if no community was found
        if (!community) {
          return new Error("This community doesn't exist.");
        }

        // user must own the community to delete the community
        if (!(community.owners.indexOf(user.uid) > -1)) {
          return new Error(
            "You don't have permission to make changes to this community."
          );
        }

        // all checks passed
        return deleteCommunity(id);
      });
    },
    editCommunity: (
      _: any,
      args: EditCommunityArguments,
      { user }: Context
    ) => {
      // user must be authed to edit a community
      if (!user)
        return new Error(
          'You must be signed in to make changes to this community.'
        );

      // get the community being modified
      return getCommunities([args.input.id]).then(communities => {
        // select the community returned
        const community = communities[0];

        // if no community was found
        if (!community) {
          return new Error("This community doesn't exist.");
        }

        // user must own the community to edit the community
        if (!(community.owners.indexOf(user.uid) > -1)) {
          return new Error(
            "You don't have permission to make changes to this community."
          );
        }

        // all checks passed
        return editCommunity(args);
      });
    },
    toggleCommunityMembership: (_: any, { id }: string, { user }: Context) => {
      // user must be authed to join a community
      if (!user)
        return new Error('You must be signed in to join this community.');

      // get the community
      return getCommunities([id]).then(communities => {
        // select the community returned
        const community = communities[0];

        // if no community was found
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

        // if the user is a member of the community
        if (community.members.indexOf(user.uid) > -1) {
          // leave the community
          return (
            leaveCommunity(id, user.uid)
              // then pass the community downstream
              .then(community => {
                return Promise.all([
                  community,
                  // selects all frequencies in the community and leaves them
                  unsubscribeFromAllFrequenciesInCommunity(id, user.uid),
                ]);
              })
              // return the community to the client
              .then(data => data[0])
          );
        } else {
          // if the user is not a member of the community
          return (
            // join the community
            joinCommunity(id, user.uid)
              // then pass the community downstream
              .then(community => {
                return Promise.all([
                  community,
                  // currently subscribes the user to the 'general' frequency
                  subscribeToDefaultFrequencies(id, user.uid),
                ]);
              })
              // return the community to the client
              .then(data => data[0])
          );
        }
      });
    },
  },
};
