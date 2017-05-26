// @flow
const { db } = require('./db');
// $FlowFixMe
import { UserError } from 'graphql-errors';

/*
===========================================================

        MODIFYING AND CREATING DATA IN USERSCOMMUNITIES

===========================================================
*/

// invoked only when a new community is being created. the user who is doing
// the creation is automatically an owner and a member
const createOwnerInCommunity = (
  communityId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersCommunities')
    .insert(
      {
        communityId,
        userId,
        createdAt: new Date(),
        isOwner: true,
        isMember: true,
        isModerator: false,
        isBlocked: false,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

// creates a single member in a community. invoked when a user joins a public
// community
const createMemberInCommunity = (
  communityId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersCommunities')
    .insert(
      {
        communityId,
        userId,
        createdAt: new Date(),
        isMember: true,
        isOwner: false,
        isModerator: false,
        isBlocked: false,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

// removes a single member from a community. will be invoked if a user leaves
// a community
const removeMemberInCommunity = (
  communityId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .filter({ userId })
    .delete()
    .run();
};

// removes all the user relationships to a community. will be invoked when a
// community is deleted, at which point we don't want any records in the
// database to show a user relationship to the deleted community
const removeMembersInCommunity = (communityId: string): Promise<Object> => {
  return db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .delete()
    .run();
};

// toggles user to blocked in a community. invoked by a community or community
// owner when managing a private community. sets pending to false to handle
// private communitys modifying pending users to be blocked
const blockUserInCommunity = (
  communityId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .filter({ userId })
    .update(
      {
        isMember: false,
        isPending: false,
        isBlocked: true,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

// unblocks a blocked user in a community. invoked by a community or community
// owner when managing a private community. this *does* add the user
// as a member
const approveBlockedUserInCommunity = (
  communityId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .filter({ userId, isBlocked: true })
    .update(
      {
        isMember: true,
        isBlocked: false,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

// adds a *new* user to a community as both a moderator and member. this will be invoked
// when a community owner invites teammates or moderators to the community before those
// people have joined the community themselves
const createModeratorInCommunity = (
  communityId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersCommunities')
    .insert(
      {
        communityId,
        userId,
        createdAt: new Date(),
        isMember: true,
        isOwner: false,
        isModerator: true,
        isBlocked: false,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

// moves an *existing* user in a community to be a moderator
const makeMemberModeratorInCommunity = (
  communityId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .filter({ userId })
    .update(
      {
        isModerator: true,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

// moves a moderator to be only a member in a community. does not remove them from the community
const removeModeratorInCommunity = (
  communityId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .filter({ userId })
    .update(
      {
        isModerator: false,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

/*
===========================================================

            GETTING DATA FROM USERSCOMMUNITIES

===========================================================
*/

const getMembersInCommunity = (communityId: string): Promise<Array<string>> => {
  return (
    db
      .table('usersCommunities')
      .getAll(communityId, { index: 'communityId' })
      .filter({ isMember: true })
      .run()
      // return an array of the userIds to be loaded by gql
      .then(users => users.map(user => user.userId))
  );
};

const getBlockedUsersInCommunity = (
  communityId: string
): Promise<Array<string>> => {
  return (
    db
      .table('usersCommunities')
      .getAll(communityId, { index: 'communityId' })
      .filter({ isBlocked: true })
      .run()
      // return an array of the userIds to be loaded by gql
      .then(users => users.map(user => user.userId))
  );
};

const getModeratorsInCommunity = (
  communityId: string
): Promise<Array<string>> => {
  return (
    db
      .table('usersCommunities')
      .getAll(communityId, { index: 'communityId' })
      .filter({ isModerator: true })
      .run()
      // return an array of the userIds to be loaded by gql
      .then(users => users.map(user => user.userId))
  );
};

const getOwnersInCommunity = (communityId: string): Promise<Array<string>> => {
  return (
    db
      .table('usersCommunities')
      .getAll(communityId, { index: 'communityId' })
      .filter({ isOwner: true })
      .run()
      // return an array of the userIds to be loaded by gql
      .then(users => users.map(user => user.userId))
  );
};

const getUserPermissionsInCommunity = (
  communityId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .filter({ userId })
    .run()
    .then(data => {
      // if a record exists
      if (data.length > 0) {
        return data[0];
      } else {
        // if a record doesn't exist, we're creating a new relationship
        // so default to false for everything
        return {
          isOwner: false,
          isMember: false,
          isModerator: false,
          isBlocked: false,
        };
      }
    });
};

module.exports = {
  // modify and create
  createOwnerInCommunity,
  createMemberInCommunity,
  removeMemberInCommunity,
  removeMembersInCommunity,
  approveBlockedUserInCommunity,
  createModeratorInCommunity,
  makeMemberModeratorInCommunity,
  removeModeratorInCommunity,
  // get
  getMembersInCommunity,
  getBlockedUsersInCommunity,
  getModeratorsInCommunity,
  getOwnersInCommunity,
  getUserPermissionsInCommunity,
};
