// @flow
const { db } = require('shared/db');
import { decrementMemberCount, setMemberCount } from './channel';
import type { DBUsersChannels } from 'shared/types';

/*
===========================================================

        MODIFYING AND CREATING DATA IN USERSCHANNELS

===========================================================
*/

// removes all the user relationships to a channel. will be invoked when a
// channel is deleted, at which point we don't want any records in the
// database to show a user relationship to the deleted channel
// prettier-ignore
const removeMembersInChannel = async (channelId: string): Promise<Array<?DBUsersChannels>> => {
  await setMemberCount(channelId, 0)

  return db
    .table('usersChannels')
    .getAll(channelId, { index: 'channelId' })
    .update({
      isMember: false,
      receiveNotifications: false,
    })
    .run();
};

// toggles all pending users to make them a member in a channel. invoked by a
// channel or community owner when turning a private channel into a public
// channel
// prettier-ignore
const approvePendingUsersInChannel = async (channelId: string): Promise<DBUsersChannels> => {
  const currentCount = await db.table('usersChannels')
    .getAll(
      [channelId, 'member'],
      [channelId, 'moderator'],
      [channelId, 'owner'],
      {
        index: 'channelIdAndRole',
      }
    )
    .count()
    .default(1)
    .run()

  const pendingCount = await db.table('usersChannels')
    .getAll([channelId, "pending"], { index: 'channelIdAndRole' })
    .count()
    .default(0)
    .run()

  setMemberCount(channelId, currentCount + pendingCount)

  return db
    .table('usersChannels')
    .getAll([channelId, "pending"], { index: 'channelIdAndRole' })
    .update(
      {
        isMember: true,
        isPending: false,
        receiveNotifications: true,
      },
      { returnChanges: true }
    )
    .run()
};

const removeUsersChannelMemberships = async (userId: string) => {
  const usersChannels = await db
    .table('usersChannels')
    .getAll(userId, { index: 'userId' })
    .run();

  if (!usersChannels || usersChannels.length === 0) return;

  const memberCountPromises = usersChannels.map(usersChannel => {
    return decrementMemberCount(usersChannel.channelId);
  });

  const channelPromise = db
    .table('usersChannels')
    .getAll(userId, { index: 'userId' })
    .update({
      isOwner: false,
      isModerator: false,
      isMember: false,
      receiveNotifications: false,
    })
    .run();

  return await Promise.all([memberCountPromises, channelPromise]);
};

/*
===========================================================

            GETTING DATA FROM USERSCHANNELS

===========================================================
*/

type Options = { first: number, after: number };
// prettier-ignore
const getMembersInChannel = (channelId: string, options: Options): Promise<Array<string>> => {
  const { first, after } = options

  return (
    db
      .table('usersChannels')
      .getAll([channelId, "member"], [channelId, "moderator"], [channelId, "owner"], { index: 'channelIdAndRole' })
      .skip(after || 0)
      .limit(first || 25)
      // return an array of the userIds to be loaded by gql
      .map(userChannel => userChannel('userId'))
      .run()
  );
};

const getModeratorsInChannel = (channelId: string): Promise<Array<string>> => {
  return (
    db
      .table('usersChannels')
      .getAll([channelId, 'moderator'], {
        index: 'channelIdAndRole',
      })
      // return an array of the userIds to be loaded by gql
      .map(userChannel => userChannel('userId'))
      .run()
  );
};

const getOwnersInChannel = (channelId: string): Promise<Array<string>> => {
  return (
    db
      .table('usersChannels')
      .getAll([channelId, 'owner'], {
        index: 'channelIdAndRole',
      })
      // return an array of the userIds to be loaded by gql
      .map(userChannel => userChannel('userId'))
      .run()
  );
};

const DEFAULT_USER_CHANNEL_PERMISSIONS = {
  isOwner: false,
  isMember: false,
  isModerator: false,
  isBlocked: false,
  isPending: false,
  receiveNotifications: false,
};

// prettier-ignore
const getUserPermissionsInChannel = (channelId: string, userId: string): Promise<DBUsersChannels> => {
  return db
    .table('usersChannels')
    .getAll([userId, channelId], { index: 'userIdAndChannelId' })
    .run()
    .then(data => {
      // if a record exists
      if (data.length > 0) {
        return data[0];
      } else {
        // if a record doesn't exist, we're creating a new relationship
        // so default to false for everything
        return DEFAULT_USER_CHANNEL_PERMISSIONS;
      }
    });
};

type UserIdAndChannelId = [?string, string];

// prettier-ignore
const getUsersPermissionsInChannels = (input: Array<UserIdAndChannelId>): Promise<Array<DBUsersChannels>> => {
  return db
    .table('usersChannels')
    .getAll(...input, { index: 'userIdAndChannelId' })
    .run()
    .then(data => {
      if (!data || data.length === 0)
        return Array.from({ length: input.length }).map((_, index) => ({
          ...DEFAULT_USER_CHANNEL_PERMISSIONS,
          userId: input[index][0],
          channelId: input[index][1],
        }));

      return data.map((rec, index) => {
        if (rec) return rec;

        return {
          ...DEFAULT_USER_CHANNEL_PERMISSIONS,
          userId: input[index][0],
          channelId: input[index][1],
        };
      });
    });
};

const getUserUsersChannels = (userId: string) => {
  return db
    .table('usersChannels')
    .getAll([userId, 'member'], [userId, 'owner'], [userId, 'moderator'], {
      index: 'userIdAndRole',
    })
    .run();
};

const getUserChannelIds = (userId: string) => {
  return db
    .table('usersChannels')
    .getAll([userId, 'member'], [userId, 'owner'], [userId, 'moderator'], {
      index: 'userIdAndRole',
    })
    .map(rec => rec('channelId'))
    .run();
};

module.exports = {
  // modify and create
  removeMembersInChannel,
  approvePendingUsersInChannel,
  removeUsersChannelMemberships,
  // get
  getMembersInChannel,
  getModeratorsInChannel,
  getOwnersInChannel,
  getUserPermissionsInChannel,
  getUsersPermissionsInChannels,
  getUserUsersChannels,
  getUserChannelIds,
  // constants
  DEFAULT_USER_CHANNEL_PERMISSIONS,
};
