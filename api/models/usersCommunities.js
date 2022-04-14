// @flow
const { db } = require('shared/db');
import { sendCommunityNotificationQueue } from 'shared/bull/queues';
import type { DBUsersCommunities, DBCommunity } from 'shared/types';
import {
  incrementMemberCount,
  decrementMemberCount,
  setMemberCount,
} from './community';

/*
===========================================================

        MODIFYING AND CREATING DATA IN USERSCOMMUNITIES

===========================================================
*/

// invoked only when a new community is being created. the user who is doing
// the creation is automatically an owner and a member
// prettier-ignore
export const createOwnerInCommunity = (communityId: string, userId: string): Promise<DBUsersCommunities> => {
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
        isPending: false,
        receiveNotifications: true,
        reputation: 0,
      },
      { returnChanges: true }
    )
    .run()
    .then(async result => {
      await Promise.all([
        incrementMemberCount(communityId)
      ])

      return result.changes[0].new_val
    });
};

// creates a single member in a community. invoked when a user joins a public
// community
// prettier-ignore
export const createMemberInCommunity = (communityId: string, userId: string): Promise<DBUsersCommunities> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], { index: 'userIdAndCommunityId' })
    .run()
    .then(result => {
      if (result && result.length > 0) {
        // if the result exists, it means the user has a previous relationship
        // with this community - since we already handled 'blocked' logic
        // in the mutation controller, we can simply update the user record
        // to be a re-joined member with notifications turned on

        return db
          .table('usersCommunities')
          .getAll([userId, communityId], { index: 'userIdAndCommunityId' })
          .update(
            {
              createdAt: new Date(),
              isMember: true,
              receiveNotifications: true,
              lastSeen: new Date(),
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
              lastSeen: new Date(),
              isMember: true,
              isOwner: false,
              isModerator: false,
              isBlocked: false,
              isPending: false,
              receiveNotifications: true,
              reputation: 0,
            },
            { returnChanges: true }
          )
          .run();
      }
    })
    .then(async result => {
      await Promise.all([
        sendCommunityNotificationQueue.add({ communityId, userId }),
        incrementMemberCount(communityId)
      ])
      return result.changes[0].new_val;
    });
};

// removes a single member from a community. will be invoked if a user leaves a community
// prettier-ignore
export const removeMemberInCommunity = (communityId: string, userId: string): Promise<DBCommunity> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], { index: 'userIdAndCommunityId'})
    .update({
      isModerator: false,
      isMember: false,
      receiveNotifications: false,
    })
    .run()
    .then(async () => {
      const community = await db
        .table('communities')
        .get(communityId)
        .run()

      await decrementMemberCount(communityId)

      return community
    })
};

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

// toggles user to blocked in a community. invoked by a community or community
// owner when managing a private community. sets pending to false to handle
// private communitys modifying pending users to be blocked
// prettier-ignore
export const blockUserInCommunity = (communityId: string, userId: string): Promise<DBUsersCommunities> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], { index: 'userIdAndCommunityId'})
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
    .then(async result => {
      await Promise.all([
        decrementMemberCount(communityId)
      ])
      return result.changes[0].new_val
    });
};

// unblocks a blocked user in a community. invoked by a community or community
// owner when managing a private community. this *does* add the user
// as a member
// prettier-ignore
export const unblockUserInCommunity = (communityId: string, userId: string): Promise<DBUsersCommunities> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], { index: 'userIdAndCommunityId' })
    .filter({ isBlocked: true })
    .update(
      {
        isModerator: false,
        isMember: true,
        isBlocked: false,
        isPending: false,
        receiveNotifications: true,
      },
      { returnChanges: true }
    )
    .run()
    .then(async result => {

      await Promise.all([
        incrementMemberCount(communityId)
      ])

      return result.changes[0].new_val
    });
};

// moves an *existing* user in a community to be a moderator
// prettier-ignore
export const makeMemberModeratorInCommunity = (communityId: string, userId: string): Promise<DBUsersCommunities> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], { index: 'userIdAndCommunityId'})
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
    .then(result => {
      return result.changes[0].new_val
    });
};

// moves a moderator to be only a member in a community. does not remove them from the community
// prettier-ignore
export const removeModeratorInCommunity = (communityId: string, userId: string): Promise<Object> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], { index: 'userIdAndCommunityId'})
    .update(
      {
        isModerator: false,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => {
      return result.changes[0].new_val
    });
};

// changes all moderators in a community to members
// prettier-ignore
export const removeModeratorsInCommunity = async (communityId: string): Promise<?Object> => {
  const moderators = await db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .filter({ isModerator: true })
    .run()

  if (!moderators || moderators.length === 0) return

  return await db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .filter({ isModerator: true })
    .update({ isModerator: false }, { returnChanges: true })
    .run();
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

// prettier-ignore
export const createPendingMemberInCommunity = async (communityId: string, userId: string): Promise<DBUsersCommunities> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], { index: 'userIdAndCommunityId' })
    .run()
    .then(result => {
      if (result && result.length > 0) {
        // if the result exists, it means the user has a previous relationship
        // with this community - we handle blocked logic upstream in the mutation,
        // so in this case we can just update the record to be pending

        return db
          .table('usersCommunities')
          .getAll([userId, communityId], { index: 'userIdAndCommunityId' })
          .update(
            {
              createdAt: new Date(),
              isPending: true
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
              isMember: false,
              isOwner: false,
              isModerator: false,
              isBlocked: false,
              isPending: true,
              receiveNotifications: true,
              reputation: 0,
            },
            { returnChanges: true }
          )
          .run();
      }
    })
    .then(result => {
      return result.changes[0].new_val;
    });
}

// prettier-ignore
export const removePendingMemberInCommunity = async (communityId: string, userId: string): Promise<Object> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], { index: 'userIdAndCommunityId'})
    .update({
      isPending: false,
    })
    .run()
}

export const approvePendingMemberInCommunity = async (
  communityId: string,
  userId: string
): Promise<DBUsersCommunities> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], { index: 'userIdAndCommunityId' })
    .update(
      {
        isMember: true,
        isPending: false,
        receiveNotifications: true,
      },
      { returnChanges: 'always' }
    )
    .run()
    .then(result => {
      incrementMemberCount(communityId);

      return result.changes[0].new_val;
    });
};

export const blockPendingMemberInCommunity = async (
  communityId: string,
  userId: string
): Promise<DBUsersCommunities> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], { index: 'userIdAndCommunityId' })
    .update(
      {
        isPending: false,
        isBlocked: true,
      },
      { returnChanges: 'always' }
    )
    .run()
    .then(result => {
      return result.changes[0].new_val;
    });
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
export const getBlockedUsersInCommunity = (communityId: string, options: Options): Promise<Array<string>> => {
  return (
    db
      .table('usersCommunities')
      .getAll([communityId, false], { index: 'communityIdAndIsMember' })
      .filter({ isBlocked: true })
      .skip(options.after || 0)
      .limit(options.first || 25)
      .map(userCommunity => userCommunity('userId'))
      .run()
  );
};

// prettier-ignore
export const getPendingUsersInCommunity = (communityId: string, options: Options): Promise<Array<string>> => {
  return (
    db
      .table('usersCommunities')
      .getAll([communityId, false], { index: 'communityIdAndIsMember' })
      .filter({ isPending: true })
      .skip(options.after || 0)
      .limit(options.first || 25)
      .map(userCommunity => userCommunity('userId'))
      .run()
  );
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

export const setCommunityLastSeen = (
  communityId: string,
  userId: string,
  lastSeen: Date
) => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], { index: 'userIdAndCommunityId' })
    .update(
      {
        lastSeen: db.branch(
          db.row('lastSeen').lt(lastSeen),
          lastSeen,
          db.row('lastSeen')
        ),
      },
      {
        returnChanges: true,
      }
    )
    .run();
};
