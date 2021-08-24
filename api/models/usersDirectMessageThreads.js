// @flow
const { db } = require('shared/db');

/*
===========================================================

  MODIFYING AND CREATING DATA IN USERSDIRECTMESSAGETHREADS

===========================================================
*/

// removes a single member from a channel. will be invoked if a user leaves
// a channel
// prettier-ignore
const removeMemberInDirectMessageThread = (threadId: string, userId: string): Promise<Object> => {
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
// prettier-ignore
const removeMembersInDirectMessageThread = (threadId: string): Promise<Object> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(threadId, { index: 'threadId' })
    .delete()
    .run();
};

/*
===========================================================

        GETTING DATA FROM USERSDIRECTMESSAGETHREADS

===========================================================
*/

// prettier-ignore
const getMembersInDirectMessageThread = (threadId: string): Promise<Array<Object>> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(threadId, { index: 'threadId' })
    .eqJoin('userId', db.table('users'))
    .without({ left: ['createdAt'], right: ['id', 'lastSeen'] })
    .zip()
    .run();
};

// for loader
// prettier-ignore
const getMembersInDirectMessageThreads = (threadIds: Array<string>): Promise<Array<Object>> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(...threadIds, { index: 'threadId' })
    .eqJoin('userId', db.table('users'))
    .without({ left: ['createdAt'], right: ['id', 'lastSeen'] })
    .group(rec => rec('left')('threadId'))
    .zip()
    .run();
};

const isMemberOfDirectMessageThread = (threadId: string, userId: string) => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(threadId, { index: 'threadId' })('userId')
    .contains(userId)
    .run();
};

const getDirectMessageThreadRecords = (threadId: string) => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(threadId, { index: 'threadId' })
    .run();
};

module.exports = {
  removeMemberInDirectMessageThread,
  removeMembersInDirectMessageThread,
  // get
  getMembersInDirectMessageThread,
  getMembersInDirectMessageThreads,
  isMemberOfDirectMessageThread,
  getDirectMessageThreadRecords,
};
