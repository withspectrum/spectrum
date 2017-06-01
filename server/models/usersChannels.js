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
    .then(result => {
      const join = result.changes[0].new_val;
      return db.table('channels').get(join.channelId);
    });
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
    .then(result => {
      const join = result.changes[0].new_val;
      return db.table('channels').get(join.channelId);
    });
};

// removes a single member from a channel. will be invoked if a user leaves
// a channel
const removeMemberInChannel = (
  channelId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersChannels')
    .getAll(channelId, { index: 'channelId' })
    .filter({ userId })
    .delete({ returnChanges: true })
    .run()
    .then(result => {
      const join = result.changes[0].old_val;
      return db.table('channels').get(join.channelId);
    });
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
    .then(result => {
      const join = result.changes[0].new_val;
      return db.table('channels').get(join.channelId);
    });
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
    .run()
    .then(result => {
      const join = result.changes[0].new_val;
      return db.table('channels').get(join.channelId);
    });
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

// toggles all pending users to make them a member in a channel. invoked by a
// channel or community owner when turning a private channel into a public
// channel
const approvePendingUsersInChannel = (channelId: string): Promise<Object> => {
  return db
    .table('usersChannels')
    .getAll(channelId, { index: 'channelId' })
    .filter({ isPending: true })
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

// creates a new relationship between the user and all of a community's
// default channels, skipping over any relationships that already exist
const createMemberInDefaultChannels = (
  communityId: string,
  userId: string
): Promise<Array<Object>> => {
  // get the default channels for the community being joined
  const defaultChannels = db
    .table('channels')
    .getAll(communityId, { index: 'communityId' })
    .filter({ isDefault: true })
    .run();

  // get the current user's relationships to all channels
  const usersChannels = db
    .table('usersChannels')
    .getAll(userId, { index: 'userId' })
    .run();

  return Promise.all([defaultChannels, usersChannels]).then(([
    defaultChannels,
    usersChannels,
  ]) => {
    // convert default channels and users channels to arrays of ids
    // to efficiently filter down to find the default channels that exist
    // which a user has not joined
    const defaultChannelIds = defaultChannels.map(channel => channel.id);
    const usersChannelIds = usersChannels.map(e => e.channelId);

    // returns a list of Ids that represent channels which are defaults
    // in the community but the user has no relationship with yet
    const defaultChannelsTheUserHasNotJoined = defaultChannelIds.filter(
      channelId => usersChannelIds.indexOf(channelId) >= -1
    );

    // create all the necessary relationships
    return Promise.all(
      defaultChannelsTheUserHasNotJoined.map(channel =>
        createMemberInChannel(channel, userId)
      )
    );
  });
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

const getUserPermissionsInChannel = (
  channelId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersChannels')
    .getAll(channelId, { index: 'channelId' })
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
          isPending: false,
        };
      }
    });
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
  approvePendingUsersInChannel,
  approveBlockedUserInChannel,
  createModeratorInChannel,
  makeMemberModeratorInChannel,
  removeModeratorInChannel,
  createMemberInDefaultChannels,
  // get
  getMembersInChannel,
  getPendingUsersInChannel,
  getBlockedUsersInChannel,
  getModeratorsInChannel,
  getOwnersInChannel,
  getUserPermissionsInChannel,
};
