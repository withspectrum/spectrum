// @flow
const { db } = require('./db');
// $FlowFixMe
import { UserError } from 'graphql-errors';

/*
===========================================================

  MODIFYING AND CREATING DATA IN USERSDIRECTMESSAGETHREADS

===========================================================
*/

// invoked only when a new direct message thread is being created. the user who is doing
// the creation is automatically an owner and a member
const createOwnerInDirectMessageThread = (
  threadId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersDirectMessageThreads')
    .insert(
      {
        threadId,
        userId,
        createdAt: new Date(),
        isOwner: true,
        isMember: true,
        isBlocked: false,
        lastActive: new Date(),
        lastSeen: new Date(),
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

// creates a single member in a direct message thread. invoked when a user is added
// to an existing direct message thread (group thread only)
const createMemberInDirectMessageThread = (
  threadId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersDirectMessageThreads')
    .insert(
      {
        threadId,
        userId,
        createdAt: new Date(),
        isMember: true,
        isOwner: false,
        isBlocked: false,
        lastActive: null,
        lastSeen: null,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

// removes a single member from a channel. will be invoked if a user leaves
// a channel
const removeMemberInDirectMessageThread = (
  threadId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(threadId, { index: 'threadId' })
    .filter({ userId })
    .delete()
    .run();
};

// removes all the user relationships to a dm thread. will be invoked when a
// dm thread is permanently deleted, at which point we don't want any records in the
// database to show a user relationship to the deleted thread
const removeMembersInDirectMessageThread = (
  threadId: string
): Promise<Object> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(threadId, { index: 'threadId' })
    .delete()
    .run();
};

// toggles user to blocked in a group thread. invoked by a thread
// owner when managing a group thread.
const blockUserInDirectMessageThread = (
  threadId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(threadId, { index: 'threadId' })
    .filter({ userId })
    .update(
      {
        isMember: false,
        isBlocked: true,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

// unblocks a blocked user in a group thread. invoked by a thread
// owner when managing a group thread. this *does* add the user
// as a member
const approveBlockedUserInDirectMessageThread = (
  threadId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(threadId, { index: 'threadId' })
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

/*
===========================================================

        GETTING DATA FROM USERSDIRECTMESSAGETHREADS

===========================================================
*/

const getMembersInDirectMessageThread = (
  threadId: string
): Promise<Array<string>> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(threadId, { index: 'threadId' })
    .filter({ isMember: true })
    .eqJoin('userId', db.table('users'))
    .without({ left: ['createdAt', 'id', 'userId'] })
    .zip()
    .run();
};

const getBlockedUsersInDirectMessageThread = (
  threadId: string
): Promise<Array<string>> => {
  return (
    db
      .table('usersDirectMessageThreads')
      .getAll(threadId, { index: 'threadId' })
      .filter({ isBlocked: true })
      .run()
      // return an array of the userIds to be loaded by gql
      .then(users => users.map(user => user.userId))
  );
};

module.exports = {
  // modify and create
  createOwnerInDirectMessageThread,
  createMemberInDirectMessageThread,
  removeMemberInDirectMessageThread,
  removeMembersInDirectMessageThread,
  blockUserInDirectMessageThread,
  approveBlockedUserInDirectMessageThread,
  // get
  getMembersInDirectMessageThread,
  getBlockedUsersInDirectMessageThread,
};
