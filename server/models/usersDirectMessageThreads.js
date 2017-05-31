// @flow
const { db } = require('./db');
// $FlowFixMe
import { UserError } from 'graphql-errors';

/*
===========================================================

  MODIFYING AND CREATING DATA IN USERSDIRECTMESSAGETHREADS

===========================================================
*/

// creates a single member in a direct message thread. invoked when a user is added
// to an existing direct message thread (group thread only)
const createMemberInDirectMessageThread = (
  threadId: string,
  userId: string,
  setActive: boolean
): Promise<Object> => {
  console.log("creating member in dm thread'", setActive);
  return db
    .table('usersDirectMessageThreads')
    .insert(
      {
        threadId,
        userId,
        createdAt: new Date(),
        lastActive: setActive ? new Date() : null,
        lastSeen: setActive ? new Date() : null,
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

const setUserLastSeenInDirectMessageThread = (
  threadId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(userId, { index: 'userId' })
    .filter({ threadId })
    .update({
      lastSeen: db.now(),
    })
    .run()
    .then(() => db.table('directMessageThreads').get(threadId).run());
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
    .eqJoin('userId', db.table('users'))
    .without({ left: ['createdAt', 'id', 'userId'] })
    .zip()
    .run();
};

module.exports = {
  createMemberInDirectMessageThread,
  removeMemberInDirectMessageThread,
  removeMembersInDirectMessageThread,
  setUserLastSeenInDirectMessageThread,
  // get
  getMembersInDirectMessageThread,
};
