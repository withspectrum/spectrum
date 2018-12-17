//@flow
const { db } = require('shared/db');

// prettier-ignore
export const getPublicChannelIdsInCommunity = (communityId: string): Promise<Array<string>> => {
  return db
    .table('channels')
    .getAll(communityId, { index: 'communityId' })
    .filter(row =>
      row
        .hasFields('deletedAt')
        .not()
        .and(row('isPrivate').eq(false))
    )
    .map(row => row('id'))
    .run();
};

// prettier-ignore
export const getPrivateChannelIdsInCommunity = (communityId: string): Promise<Array<string>> => {
  return db
    .table('channels')
    .getAll(communityId, { index: 'communityId' })
    .filter(row =>
      row
        .hasFields('deletedAt')
        .not()
        .and(row('isPrivate').eq(true))
    )
    .map(row => row('id'))
    .run();
};

// prettier-ignore
export const getPublicChannelIdsForUsersThreads = (userId: string): Promise<Array<string>> => {
  return db
    .table('threads')
    .getAll(userId, { index: 'creatorId' })
    .filter(row => row.hasFields('deletedAt').not())
    .eqJoin('channelId', db.table('channels'))
    .filter(row => row('right')('isPrivate').eq(false))
    .zip()
    .map(row => row('channelId'))
    .run();
};

export const getPublicCommunityIdsForUsersThreads = (
  userId: string
): Promise<Array<string>> => {
  return db
    .table('threads')
    .getAll(userId, { index: 'creatorId' })
    .filter(row => row.hasFields('deletedAt').not())
    .eqJoin('communityId', db.table('communities'))
    .filter(row => row('right')('isPrivate').eq(false))
    .zip()
    .map(row => row('communityId'))
    .run();
};

// prettier-ignore
export const getPrivateChannelIdsForUsersThreads = (userId: string): Promise<Array<string>> => {
  return db
    .table('threads')
    .getAll(userId, { index: 'creatorId' })
    .filter(row => row.hasFields('deletedAt').not())
    .eqJoin('channelId', db.table('channels'))
    .filter(row => row('right')('isPrivate').eq(true))
    .zip()
    .map(row => row('channelId'))
    .run();
};

export const getPrivateCommunityIdsForUsersThreads = (
  userId: string
): Promise<Array<string>> => {
  return db
    .table('threads')
    .getAll(userId, { index: 'creatorId' })
    .filter(row => row.hasFields('deletedAt').not())
    .eqJoin('communityId', db.table('communities'))
    .filter(row => row('right')('isPrivate').eq(true))
    .zip()
    .map(row => row('communityId'))
    .run();
};

// prettier-ignore
export const getUsersJoinedChannels = (userId: string): Promise<Array<string>> => {
  return db
    .table('usersChannels')
    .getAll([userId, "member"], [userId, "moderator"], [userId, "owner"], { index: 'userIdAndRole' })
    .eqJoin('channelId', db.table('channels'))
    .filter(row => row('right').hasFields('deletedAt').not())
    .zip()
    .map(row => row('channelId'))
    .run();
};

// prettier-ignore
export const getUsersJoinedCommunities = (userId: string): Promise<Array<string>> => {
  return db
    .table('usersCommunities')
    .getAll([userId, true], { index: 'userIdAndIsMember' })
    .eqJoin('communityId', db.table('communities'))
    .filter(row => row('right').hasFields('deletedAt').not())
    .zip()
    .map(row => row('communityId'))
    .run();
};

// prettier-ignore
export const getUsersJoinedPrivateChannelIds = (userId: string): Promise<Array<string>> => {
  return db
    .table('usersChannels')
    .getAll([userId, "member"], [userId, "moderator"], [userId, "owner"], { index: 'userIdAndRole' })
    .eqJoin('channelId', db.table('channels'))
    .filter(row => row('right')('isPrivate').eq(true).and(row('right').hasFields('deletedAt').not()))
    .without({ left: ['id'] })
    .zip()
    .map(row => row('id'))
    .run();
};

// prettier-ignore
export const getUsersJoinedPrivateCommunityIds = (userId: string): Promise<Array<string>> => {
  return db
    .table('usersCommunities')
    .getAll([userId, true], { index: 'userIdAndIsMember' })
    .eqJoin('communityId', db.table('communities'))
    .filter(row => row('right')('isPrivate').eq(true).and(row('right').hasFields('deletedAt').not()))
    .without({ left: ['id'] })
    .zip()
    .map(row => row('id'))
    .run();
};
