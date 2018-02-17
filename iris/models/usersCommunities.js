// @flow
const { db } = require('./db');
import { sendCommunityNotificationQueue } from 'shared/bull/queues';
import type { DBUsersCommunities } from 'shared/types';

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
        receiveNotifications: true,
        reputation: 0,
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
    .getAll(userId, { index: 'userId' })
    .filter({ communityId })
    .run()
    .then(result => {
      if (result && result.length > 0) {
        // if the result exists, it means the user has a previous relationship
        // with this community - since we already handled 'blocked' logic
        // in the mutation controller, we can simply update the user record
        // to be a re-joined member with notifications turned on

        return db
          .table('usersCommunities')
          .getAll(userId, { index: 'userId' })
          .filter({ communityId })
          .update(
            {
              createdAt: new Date(),
              isMember: true,
              receiveNotifications: true,
            },
            { returnChanges: 'always' }
          )
          .run();
      } else {
        // if no relationship exists, we can create a new one from scratch
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
              receiveNotifications: true,
              reputation: 0,
            },
            { returnChanges: true }
          )
          .run();
      }
    })
    .then(result => {
      sendCommunityNotificationQueue.add({ communityId, userId });
      return result.changes[0].new_val;
    });
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
    .update({
      isModerator: false,
      isMember: false,
      receiveNotifications: false,
    })
    .run()
    .then(() =>
      db
        .table('communities')
        .get(communityId)
        .run()
    );
};

// removes all the user relationships to a community. will be invoked when a
// community is deleted, at which point we don't want any records in the
// database to show a user relationship to the deleted community
const removeMembersInCommunity = (communityId: string): Promise<Object> => {
  return db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .update({
      isMember: false,
      receiveNotifications: false,
    })
    .run();
};

// toggles user to blocked in a community. invoked by a community or community
// owner when managing a private community. sets pending to false to handle
// private communitys modifying pending users to be blocked
const blockUserInCommunity = (
  communityId: string,
  userId: string
): Promise<DBUsersCommunities> => {
  return db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .filter({ userId })
    .update(
      {
        isMember: false,
        isPending: false,
        isBlocked: true,
        isModerator: false,
        receiveNotifications: false,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

// unblocks a blocked user in a community. invoked by a community or community
// owner when managing a private community. this *does* add the user
// as a member
const unblockUserInCommunity = (
  communityId: string,
  userId: string
): Promise<DBUsersCommunities> => {
  return db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .filter({ userId, isBlocked: true })
    .update(
      {
        isModerator: false,
        isMember: true,
        isBlocked: false,
        receiveNotifications: true,
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
): Promise<DBUsersCommunities> => {
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
        receiveNotifications: true,
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
): Promise<DBUsersCommunities> => {
  return db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .filter({ userId })
    .update(
      {
        isBlocked: false,
        isMember: true,
        isModerator: true,
        receiveNotifications: true,
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

const getMembersInCommunity = (
  communityId: string,
  { first, after }: { first: number, after: number },
  filter: Object
): Promise<Array<string>> => {
  return (
    db
      .table('usersCommunities')
      .getAll(communityId, { index: 'communityId' })
      .filter(filter ? filter : { isMember: true })
      .orderBy(db.desc('reputation'))
      .skip(after || 0)
      .limit(first || 999999)
      // return an array of the userIds to be loaded by gql
      .map(userCommunity => userCommunity('userId'))
      .run()
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
      // return an array of the userIds to be loaded by gql
      .map(userCommunity => userCommunity('userId'))
      .run()
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
      // return an array of the userIds to be loaded by gql
      .map(userCommunity => userCommunity('userId'))
      .run()
  );
};

const getOwnersInCommunity = (communityId: string): Promise<Array<string>> => {
  return (
    db
      .table('usersCommunities')
      .getAll(communityId, { index: 'communityId' })
      .filter({ isOwner: true })
      // return an array of the userIds to be loaded by gql
      .map(userCommunity => userCommunity('userId'))
      .run()
  );
};

const DEFAULT_USER_COMMUNITY_PERMISSIONS = {
  isOwner: false,
  isMember: false,
  isModerator: false,
  isBlocked: false,
  receiveNotifications: false,
  reputation: 0,
};

// NOTE @BRIAN: DEPRECATED - DONT USE IN THE FUTURE
const getUserPermissionsInCommunity = (
  communityId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], {
      index: 'userIdAndCommunityId',
    })
    .run()
    .then(data => {
      // if a record exists
      if (data.length > 0) {
        return data[0];
      } else {
        // if a record doesn't exist, we're creating a new relationship
        // so default to false for everything
        return {
          ...DEFAULT_USER_COMMUNITY_PERMISSIONS,
          userId,
          communityId,
        };
      }
    });
};

const checkUserPermissionsInCommunity = (
  communityId: string,
  userId: string
): Promise<DBUsersCommunities> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], { index: 'userIdAndCommunityId' })
    .run();
};

type UserIdAndCommunityId = [string, string];

const getUsersPermissionsInCommunities = (
  input: Array<UserIdAndCommunityId>
) => {
  return db
    .table('usersCommunities')
    .getAll(...input, { index: 'userIdAndCommunityId' })
    .run()
    .then(data => {
      if (!data)
        return Array.from({ length: input.length }, (_, index) => ({
          ...DEFAULT_USER_COMMUNITY_PERMISSIONS,
          userId: input[index][0],
          communityId: input[index][1],
        }));

      return data.map(
        (rec, index) =>
          rec
            ? rec
            : {
                ...DEFAULT_USER_COMMUNITY_PERMISSIONS,
                userId: input[index][0],
                communityId: input[index][1],
              }
      );
    });
};

const getReputationByUser = (userId: string): Promise<Number> => {
  return db
    .table('usersCommunities')
    .getAll(userId, { index: 'userId' })
    .filter({ isMember: true })
    .map(rec => rec('reputation'))
    .reduce((l, r) => l.add(r))
    .default(0)
    .run();
};

const getUsersTotalReputation = (
  userIds: Array<string>
): Promise<Array<number>> => {
  return db
    .table('usersCommunities')
    .getAll(...userIds, { index: 'userId' })
    .filter({ isMember: true })
    .group('userId')
    .map(rec => rec('reputation'))
    .reduce((l, r) => l.add(r))
    .default(0)
    .run()
    .then(res =>
      res.map(
        res =>
          res && {
            reputation: res.reduction,
            userId: res.group,
          }
      )
    );
};

module.exports = {
  // modify and create
  createOwnerInCommunity,
  createMemberInCommunity,
  removeMemberInCommunity,
  removeMembersInCommunity,
  blockUserInCommunity,
  unblockUserInCommunity,
  createModeratorInCommunity,
  makeMemberModeratorInCommunity,
  removeModeratorInCommunity,
  // get
  DEFAULT_USER_COMMUNITY_PERMISSIONS,
  getMembersInCommunity,
  getBlockedUsersInCommunity,
  getModeratorsInCommunity,
  getOwnersInCommunity,
  getUserPermissionsInCommunity,
  checkUserPermissionsInCommunity,
  getReputationByUser,
  getUsersTotalReputation,
  getUsersPermissionsInCommunities,
};
