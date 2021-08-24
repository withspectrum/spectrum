// @flow
const { db } = require('shared/db');
import type { DBUsersCommunities } from 'shared/types';
import { decrementMemberCount, setMemberCount } from './community';

/*
===========================================================

        MODIFYING AND CREATING DATA IN USERSCOMMUNITIES

===========================================================
*/

// removes all the user relationships to a community. will be invoked when a
// community is deleted, at which point we don't want any records in the
// database to show a user relationship to the deleted community
// prettier-ignore
export const removeMembersInCommunity = async (communityId: string): Promise<?Object> => {

  const usersCommunities = await db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .run()

  if (!usersCommunities || usersCommunities.length === 0) return
  const leavePromise = await db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .update({
      isMember: false,
      receiveNotifications: false,
    })
    .run();

  return await Promise.all([
    setMemberCount(communityId, 0),
    leavePromise
  ])
};

// invoked when a user is deleting their account or being banned
export const removeUsersCommunityMemberships = async (userId: string) => {
  const memberships = await db
    .table('usersCommunities')
    .getAll(userId, { index: 'userId' })
    .run();

  if (!memberships || memberships.length === 0) return;

  const memberCountPromises = memberships.map(member => {
    return decrementMemberCount(member.communityId);
  });

  const removeMembershipsPromise = db
    .table('usersCommunities')
    .getAll(userId, { index: 'userId' })
    .update({
      isOwner: false,
      isModerator: false,
      isMember: false,
      isPending: false,
      receiveNotifications: false,
    })
    .run();

  return Promise.all([memberCountPromises, removeMembershipsPromise]);
};

/*
===========================================================

            GETTING DATA FROM USERSCOMMUNITIES

===========================================================
*/

type Options = { first: number, after: number };

// prettier-ignore
export const getMembersInCommunity = (communityId: string, options: Options): Promise<Array<string>> => {
  const { first, after } = options
  return db
    .table('usersCommunities')
    .between([communityId, true, db.minval], [communityId, true, db.maxval], {
      index: 'communityIdAndIsMemberAndReputation',
      leftBound: 'open',
      rightBound: 'open',
    })
    .orderBy({ index: db.desc('communityIdAndIsMemberAndReputation') })
    .skip(after || 0)
    .limit(first || 25)
    .map(userCommunity => userCommunity('userId'))
    .run()
};

// prettier-ignore
export const getModeratorsInCommunity = (communityId: string, options: Options): Promise<Array<string>> => {
  return (
    db
      .table('usersCommunities')
      .getAll([communityId, true], { index: 'communityIdAndIsModerator' })
      .skip(options.after || 0)
      .limit(options.first || 25)
      .map(userCommunity => userCommunity('userId'))
      .run()
  );
};

export const getOwnersInCommunity = (
  communityId: string,
  options: Options
): Promise<Array<string>> => {
  return db
    .table('usersCommunities')
    .getAll([communityId, true], { index: 'communityIdAndIsOwner' })
    .skip(options.after || 0)
    .limit(options.first || 25)
    .map(userCommunity => userCommunity('userId'))
    .run();
};

export const getTeamMembersInCommunity = (
  communityId: string,
  options: Options
): Promise<Array<string>> => {
  return db
    .table('usersCommunities')
    .getAll([communityId, true], { index: 'communityIdAndIsTeamMember' })
    .skip(options.after || 0)
    .limit(options.first || 25)
    .map(userCommunity => userCommunity('userId'))
    .run();
};

export const DEFAULT_USER_COMMUNITY_PERMISSIONS = {
  isOwner: false,
  isMember: false,
  isModerator: false,
  isBlocked: false,
  isPending: false,
  receiveNotifications: false,
  reputation: 0,
};

// NOTE @BRIAN: DEPRECATED - DONT USE IN THE FUTURE
// prettier-ignore
export const getUserPermissionsInCommunity = (communityId: string, userId: string): Promise<Object> => {
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

// prettier-ignore
export const checkUserPermissionsInCommunity = (communityId: string, userId: string): Promise<DBUsersCommunities> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], { index: 'userIdAndCommunityId' })
    .run();
};

type UserIdAndCommunityId = [?string, string];

// prettier-ignore
export const getUsersPermissionsInCommunities = (input: Array<UserIdAndCommunityId>) => {
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

export const getReputationByUser = (userId: string): Promise<Number> => {
  return db
    .table('usersCommunities')
    .getAll([userId, true], { index: 'userIdAndIsMember' })
    .map(rec => rec('reputation'))
    .count()
    .default(0)
    .run();
};

// prettier-ignore
export const getUsersTotalReputation = (userIds: Array<string>): Promise<Array<number>> => {
  return db
    .table('usersCommunities')
    .getAll(...userIds.map(userId => ([userId, true])), { index: 'userIdAndIsMember' })
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
