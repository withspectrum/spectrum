// @flow
// $FlowFixMe
const { UserError } = require('graphql-errors');
import {
  getFrequencies,
  getFrequencyBySlug,
  editFrequency,
  createFrequency,
  deleteFrequency,
  unsubscribeFrequency,
  subscribeFrequency,
  addRequestToJoinFrequency,
  removeRequestToJoinFrequency,
  addBlockedUser,
  removeBlockedUser,
} from '../models/frequency';
import {
  getCommunities,
  joinCommunity,
  leaveCommunity,
  userIsMemberOfCommunity,
  userIsMemberOfAnyFrequencyInCommunity,
  subscribeToDefaultFrequencies,
} from '../models/community';
import type {
  CreateFrequencyArguments,
  EditFrequencyArguments,
} from '../models/frequency';

type Context = {
  user: Object,
};

module.exports = {
  Mutation: {
    createFrequency: (
      _: any,
      args: CreateFrequencyArguments,
      { user }: Context
    ) => {
      // user must be authed to create a frequency
      if (!user)
        return new UserError(
          'You must be signed in to create a new community.'
        );

      // get the community the frequency is being created under
      return (
        getCommunities([args.input.community])
          // return the communities
          .then(communities => {
            // select the community where the frequency is being created
            const community = communities[0];

            // if the user does not own the community
            if (!(community.owners.indexOf(user.uid) > -1)) {
              return new UserError(
                "You don't have permission to create a frequency in this community."
              );
            }

            return community;
          })
          .then(community =>
            getFrequencyBySlug(args.input.slug, community.slug)
          )
          .then(frequency => {
            // a frequency with the slug sent from the client already exists
            if (frequency) {
              return new UserError(
                'A frequency with this slug already exists.'
              );
            }

            // all checks passed
            return createFrequency(args, user.uid);
          })
      );
    },
    deleteFrequency: (_: any, { id }, { user }: Context) => {
      // user must be authed to delete a frequency
      if (!user)
        return new UserError(
          'You must be signed in to make changes to this frequency.'
        );

      // get the frequency being deleted
      return (
        getFrequencies([id])
          // return frequencies
          .then(frequencies => {
            // select the frequency being deleted
            const frequency = frequencies[0];

            // if frequency wasn't found or was previously deleted
            if (!frequency || frequency.deleted) {
              return new UserError("Frequency doesn't exist");
            }

            // get the community parent of the frequency being deleted
            const communities = getCommunities([frequency.community]);

            return Promise.all([frequency, communities]);
          })
          .then(([frequency, communities]) => {
            // select the community
            const community = communities[0];

            // determine the role in the frequency and community
            const isCommunityOwner = community.owners.indexOf(user.uid) > -1;
            const isFrequencyOwner = frequency.owners.indexOf(user.uid) > -1;

            // NOTE: This will need to change in the future if we have the concept
            // of moderator-owner frequencies where the community owner is not
            // listed as an owner of the frequency. In today's code we mirror
            // the owners at time of frequency creation
            if (isCommunityOwner || isFrequencyOwner) {
              // all checks passed
              return deleteFrequency(id);
            } else {
              return new UserError(
                "You don't have permission to make changes to this frequency"
              );
            }
          })
      );
    },
    editFrequency: (
      _: any,
      args: EditFrequencyArguments,
      { user }: Context
    ) => {
      // user must be authed to edit a frequency
      if (!user)
        return new UserError(
          'You must be signed in to make changes to this frequency.'
        );

      // get the frequency being edited
      return (
        getFrequencies([args.input.id])
          // return the frequencies
          .then(frequencies => {
            // select the frequency
            const frequency = frequencies[0];

            // if frequency wasn't found or was deleted
            if (!frequency || frequency.deleted) {
              return new UserError("This frequency doesn't exist");
            }

            // if user doesn't own the frequency
            if (!(frequency.owners.indexOf(user.uid) > -1)) {
              return new UserError(
                "You don't have permission to make changes to this frequency."
              );
            }

            // get the community parent of the frequency being edited
            const communities = getCommunities([frequency.community]);

            return Promise.all([frequency, communities]);
          })
          .then(([frequency, communities]) => {
            // select the community
            const community = communities[0];

            // if user is doesn't own the community

            // NOTE: This will need to change in the future if we have the concept
            // of moderator-owner frequencies where the community owner is not
            // listed as an owner of the frequency. In today's code we mirror
            // the owners at time of frequency creation
            if (!(community.owners.indexOf(user.uid) > -1)) {
              return new UserError(
                "You don't have permission to make changes to this frequency."
              );
            }

            // all checks passed
            return editFrequency(args);
          })
      );
    },
    toggleFrequencySubscription: (
      _: any,
      { id }: string,
      { user }: Context
    ) => {
      // user must be authed to join a frequency
      if (!user)
        return new UserError('You must be signed in to follow this frequency.');

      // get the frequency being edited
      return getFrequencies([id]).then(frequencies => {
        // select the frequency
        const frequency = frequencies[0];

        // if frequency wasn't found or was deleted
        if (!frequency || frequency.deleted) {
          return new UserError("This frequency doesn't exist");
        }

        // user is blocked
        if (frequency.blockedUsers.indexOf(user.uid) > -1) {
          return new UserError("You don't have permission to do that.");
        }

        // if the person owns the frequency, they have accidentally triggered
        // a join or leave action, which isn't allowed
        if (frequency.owners.indexOf(user.uid) > -1) {
          return new UserError(
            "Owners of a community can't join or leave their own frequency."
          );
        }

        // if the user is current following the frequency
        if (frequency.subscribers.indexOf(user.uid) > -1) {
          // unsubscribe them from the frequency
          return (
            unsubscribeFrequency(id, user.uid)
              .then(frequency => {
                return Promise.all([
                  frequency,

                  // we check to see if the user is part of any other frequencies
                  // in the community - returns a boolean
                  userIsMemberOfAnyFrequencyInCommunity(
                    frequency.community,
                    user.uid
                  ),
                ]);
              })
              .then(([frequency, isMemberOfAnotherFrequency]) => {
                // if user is a member of another frequency in the community,
                // continue
                if (isMemberOfAnotherFrequency) {
                  return Promise.all([frequency]);
                }

                // if user is not a member of any other frequencies in the community,
                // we can assume that they no longer want to be part of the community
                if (!isMemberOfAnotherFrequency) {
                  // leave the community
                  return Promise.all([
                    frequency,
                    leaveCommunity(frequency.community, user.uid),
                  ]);
                }
              })
              // return the frequency
              .then(data => data[0])
          );
        } else {
          // if the user is not currently following the frequency, determine the privacy
          // of the frequency, the user's pending state, and perform the corresponding action

          // user has already requested to join, so remove them from pending
          if (frequency.pendingUsers.indexOf(user.uid) > -1) {
            return removeRequestToJoinFrequency(id, user.uid);
          }

          // if the frequency is private, request to join - since this action
          // doesn't actually join the frequency, we don't need to perform
          // the downstream checks to see if the user needs to join the parent
          // community - those actions will instead be handled when the frequency
          // owner approves the user
          if (frequency.isPrivate) {
            return addRequestToJoinFrequency(id, user.uid);
          }

          return (
            subscribeFrequency(id, user.uid)
              .then(frequency => {
                // check to see if the user is a member of the parent community
                // returns a boolean
                return Promise.all([
                  frequency,
                  userIsMemberOfCommunity(frequency.community, user.uid),
                ]);
              })
              .then(([frequency, isMember]) => {
                // if the user is a member of the parent community, continue
                if (isMember) {
                  return Promise.all([frequency]);
                }

                // if the user is not a member of the parent community,
                // join the community and the community's defualt frequencies
                // (currently just 'general')
                if (!isMember) {
                  return Promise.all([
                    frequency,
                    joinCommunity(frequency.community, user.uid),
                    subscribeToDefaultFrequencies(
                      frequency.community,
                      user.uid
                    ),
                  ]);
                }
              })
              // return the frequency
              .then(data => data[0])
          );
        }
      });
    },
    togglePendingUser: (_: any, { input }, { user }: Context) => {
      // user must be authed to edit a frequency
      if (!user)
        return new UserError(
          'You must be signed in to make changes to this frequency.'
        );

      // get the frequency being edited
      return (
        getFrequencies([input.id])
          // return the frequencies
          .then(frequencies => {
            // select the frequency
            const frequency = frequencies[0];

            // if frequency wasn't found or was deleted
            if (!frequency || frequency.deleted) {
              return new UserError("This frequency doesn't exist");
            }

            // if user doesn't own the frequency
            if (!(frequency.owners.indexOf(user.uid) > -1)) {
              return new UserError(
                "You don't have permission to make changes to this frequency."
              );
            }

            // get the community parent of the frequency being edited
            const communities = getCommunities([frequency.community]);

            return Promise.all([frequency, communities]);
          })
          .then(([frequency, communities]) => {
            // select the community
            const community = communities[0];

            // if user is doesn't own the community

            // NOTE: This will need to change in the future if we have the concept
            // of moderator-owner frequencies where the community owner is not
            // listed as an owner of the frequency. In today's code we mirror
            // the owners at time of frequency creation
            if (!(community.owners.indexOf(user.uid) > -1)) {
              return new UserError(
                "You don't have permission to make changes to this frequency."
              );
            }

            const { id, uid, action } = input;

            // if the user isn't on the pending list
            if (!(frequency.pendingUsers.indexOf(uid) > -1)) {
              return new UserError(
                'This user is not currently pending access to this frequency.'
              );
            }

            // user is in the pending list
            // determine whether to approve or block them
            if (action === 'block') {
              // remove the user from the pending list
              return removeRequestToJoinFrequency(id, uid).then(frequency => {
                return addBlockedUser(id, uid);
              });
            }

            if (action === 'approve') {
              // remove the user from the pending list
              return (
                removeRequestToJoinFrequency(id, uid)
                  // we have to determine if this is the first frequency the user is
                  // joining in a community. if so, we will add them to the community
                  // and the community's default frequencies
                  .then(frequency => {
                    // user is already in the community, and therefore is already
                    // in the default frequencies (general, for now)
                    // subscribe them to the approved frequency
                    if (community.members.indexOf(uid) > -1) {
                      return subscribeFrequency(id, uid);
                    } else {
                      // user is not in the community, so we need to add them to
                      // the community and the community's default frequencies
                      return (
                        Promise.all([
                          frequency,
                          subscribeFrequency(id, uid), // approve them in the current frequency
                          joinCommunity(frequency.community, uid), // join the parent community
                          subscribeToDefaultFrequencies(
                            // join the parent community's defaults
                            frequency.community,
                            uid
                          ),
                        ])
                          // return the frequency
                          .then(data => data[0])
                      );
                    }
                  })
              );
            }

            // invalid action type
            return new UserError('Unknown action request on a pending user.');
          })
      );
    },
    unblockUser: (_: any, { input }, { user }: Context) => {
      // user must be authed to edit a frequency
      if (!user)
        return new UserError(
          'You must be signed in to make changes to this frequency.'
        );

      // get the frequency being edited
      return (
        getFrequencies([input.id])
          // return the frequencies
          .then(frequencies => {
            // select the frequency
            const frequency = frequencies[0];

            // if frequency wasn't found or was deleted
            if (!frequency || frequency.deleted) {
              return new UserError("This frequency doesn't exist");
            }

            // if user doesn't own the frequency
            if (!(frequency.owners.indexOf(user.uid) > -1)) {
              return new UserError(
                "You don't have permission to make changes to this frequency."
              );
            }

            // get the community parent of the frequency being edited
            const communities = getCommunities([frequency.community]);

            return Promise.all([frequency, communities]);
          })
          .then(([frequency, communities]) => {
            // select the community
            const community = communities[0];

            // if user is doesn't own the community

            // NOTE: This will need to change in the future if we have the concept
            // of moderator-owner frequencies where the community owner is not
            // listed as an owner of the frequency. In today's code we mirror
            // the owners at time of frequency creation
            if (!(community.owners.indexOf(user.uid) > -1)) {
              return new UserError(
                "You don't have permission to make changes to this frequency."
              );
            }

            const { id, uid } = input;

            // if the user isn't on the pending list
            if (!(frequency.blockedUsers.indexOf(uid) > -1)) {
              return new UserError(
                'This user is not currently blocked in this channel.'
              );
            }

            // all checks passed
            return removeBlockedUser(id, uid);
          })
      );
    },
  },
};
