// @flow
const { db } = require('./db');
// $FlowFixMe
import { UserError } from 'graphql-errors';

/*
===========================================================

        MODIFYING AND CREATING DATA IN USERSCHANNELS

===========================================================
*/

// invoked only when a new channel is being created. the user who is doing
// the creation is automatically an owner and a member
const createOwnerInChannel = (
  channelId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersChannels')
    .insert(
      {
        channelId,
        userId,
        createdAt: new Date(),
        isOwner: true,
        isMember: true,
        isModerator: false,
        isBlocked: false,
        isPending: false,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

// creates a single member in a channel. invoked when a user joins a public
// channel
const createMemberInChannel = (
  channelId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersChannels')
    .insert(
      {
        channelId,
        userId,
        createdAt: new Date(),
        isMember: true,
        isOwner: false,
        isModerator: false,
        isBlocked: false,
        isPending: false,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

// removes a single member from a channel. will be invoked if a user leaves
// a channel
const removeMemberInChannel = (
  channelId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersChannels')
    .getAll(communityId, { index: 'communityId' })
    .filter({ userId })
    .delete()
    .run();
};

// removes all the user relationships to a channel. will be invoked when a
// channel is deleted, at which point we don't want any records in the
// database to show a user relationship to the deleted channel
const removeMembersInChannel = (channelId: string): Promise<Object> => {
  return db
    .table('usersChannels')
    .getAll(channelId, { index: 'channelId' })
    .delete()
    .run();
};

// creates a single pending user in channel. invoked only when a user is requesting
// to join a private channel
const createPendingUserInChannel = (
  channelId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersChannels')
    .insert(
      {
        channelId,
        userId,
        createdAt: new Date(),
        isMember: false,
        isOwner: false,
        isModerator: false,
        isBlocked: false,
        isPending: true,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

// removes a collection of pending users from a channel. invoked only when a private
// channel is converted into a public channel, at which point we delete all pending
// user associations. this will allow those pending users to re-join if they
// choose, but will not add unwanted users to the now-public channel
const removePendingUsersInChannel = (channelId: string): Promise<Object> => {
  return db
    .table('usersChannels')
    .getAll(channelId, { index: 'channelId' })
    .filter({ isPending: true })
    .delete()
    .run();
};

// toggles user to blocked in a channel. invoked by a channel or community
// owner when managing a private channel. sets pending to false to handle
// private channels modifying pending users to be blocked
const blockUserInChannel = (
  channelId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersChannels')
    .getAll(channelId, { index: 'channelId' })
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

// toggles a pending user to member in a channel. invoked by a channel or community
// owner when managing a private channel
const approvePendingUserInChannel = (
  channelId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersChannels')
    .getAll(channelId, { index: 'channelId' })
    .filter({ userId })
    .update(
      {
        isMember: true,
        isPending: false,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

// unblocks a blocked user in a channel. invoked by a channel or community
// owner when managing a private channel. this *does* add the user
// as a member
const approveBlockedUserInChannel = (
  channelId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersChannels')
    .getAll(channelId, { index: 'channelId' })
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

// adds a *new* user to a channel as both a moderator and member. this will be invoked
// when a community owner invites teammates or moderators to the channel before those
// people have joined the channel themselves
const createModeratorInChannel = (
  channelId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersChannels')
    .insert(
      {
        channelId,
        userId,
        createdAt: new Date(),
        isMember: true,
        isOwner: false,
        isModerator: true,
        isBlocked: false,
        isPending: false,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

// moves an *existing* user in a channel to be a moderator
const makeMemberModeratorInChannel = (
  channelId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersChannels')
    .getAll(channelId, { index: 'channelId' })
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

// moves a moderator to be only a member in a channel. does not remove them from the channel
const removeModeratorInChannel = (
  channelId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersChannels')
    .getAll(channelId, { index: 'channelId' })
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

            GETTING DATA FROM USERSCHANNELS

===========================================================
*/

const getMembersInChannel = (channelId: string): Promise<Array<string>> => {
  return (
    db
      .table('usersChannels')
      .getAll(channelId, { index: 'channelId' })
      .filter({ isMember: true })
      .run()
      // return an array of the userIds to be loaded by gql
      .then(users => users.map(user => user.userId))
  );
};

const getPendingUsersInChannel = (
  channelId: string
): Promise<Array<string>> => {
  return (
    db
      .table('usersChannels')
      .getAll(channelId, { index: 'channelId' })
      .filter({ isPending: true })
      .run()
      // return an array of the userIds to be loaded by gql
      .then(users => users.map(user => user.userId))
  );
};

const getBlockedUsersInChannel = (
  channelId: string
): Promise<Array<string>> => {
  return (
    db
      .table('usersChannels')
      .getAll(channelId, { index: 'channelId' })
      .filter({ isBlocked: true })
      .run()
      // return an array of the userIds to be loaded by gql
      .then(users => users.map(user => user.userId))
  );
};

const getModeratorsInChannel = (channelId: string): Promise<Array<string>> => {
  return (
    db
      .table('usersChannels')
      .getAll(channelId, { index: 'channelId' })
      .filter({ isModerator: true })
      .run()
      // return an array of the userIds to be loaded by gql
      .then(users => users.map(user => user.userId))
  );
};

const getOwnersInChannel = (channelId: string): Promise<Array<string>> => {
  return (
    db
      .table('usersChannels')
      .getAll(channelId, { index: 'channelId' })
      .filter({ isOwner: true })
      .run()
      // return an array of the userIds to be loaded by gql
      .then(users => users.map(user => user.userId))
  );
};

module.exports = {
  // modify and create
  createOwnerInChannel,
  createMemberInChannel,
  removeMemberInChannel,
  removeMembersInChannel,
  createPendingUserInChannel,
  removePendingUsersInChannel,
  blockUserInChannel,
  approvePendingUserInChannel,
  approveBlockedUserInChannel,
  createModeratorInChannel,
  makeMemberModeratorInChannel,
  removeModeratorInChannel,
  // get
  getMembersInChannel,
  getPendingUsersInChannel,
  getBlockedUsersInChannel,
  getModeratorsInChannel,
  getOwnersInChannel,
};
