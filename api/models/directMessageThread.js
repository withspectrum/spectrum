//@flow
const { db } = require('shared/db');
import { NEW_DOCUMENTS } from './utils';
import { createChangefeed } from 'shared/changefeed-utils';
import { getDirectMessageThreadRecords } from './usersDirectMessageThreads';

export type DBDirectMessageThread = {
  createdAt: Date,
  id: string,
  name?: string,
  threadLastActive: Date,
};

// prettier-ignore
const getDirectMessageThread = (directMessageThreadId: string): Promise<DBDirectMessageThread> => {
  return db
    .table('directMessageThreads')
    .get(directMessageThreadId)
    .run()
    .then(res => res && !res.deletedAt ? res : null);
};

// prettier-ignore
const getDirectMessageThreads = (ids: Array<string>): Promise<Array<DBDirectMessageThread>> => {
  return db
    .table('directMessageThreads')
    .getAll(...ids)
    .filter(row => row.hasFields('deletedAt').not())
    .run();
};

const getDirectMessageThreadsByUser = (
  userId: string,
  // $FlowFixMe
  { first, after }
): Promise<Array<DBDirectMessageThread>> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(userId, { index: 'userId' })
    .filter(row => row.hasFields('deletedAt').not())
    .eqJoin('threadId', db.table('directMessageThreads'))
    .without({
      left: ['id', 'createdAt', 'threadId', 'userId', 'lastActive', 'lastSeen'],
    })
    .zip()
    .orderBy(db.desc('threadLastActive'))
    .skip(after || 0)
    .limit(first)
    .run();
};

// prettier-ignore
const createDirectMessageThread = (isGroup: boolean, userId: string): DBDirectMessageThread => {
  return db
    .table('directMessageThreads')
    .insert(
      {
        createdAt: new Date(),
        name: null,
        isGroup,
        threadLastActive: new Date(),
      },
      { returnChanges: true }
    )
    .run()
    .then(result => {
      return result.changes[0].new_val
    });
};

// prettier-ignore
const setDirectMessageThreadLastActive = (id: string): DBDirectMessageThread => {
  return db
    .table('directMessageThreads')
    .get(id)
    .update({
      threadLastActive: db.now(),
    })
    .run();
};

const hasChanged = (field: string) =>
  db
    .row('old_val')(field)
    .ne(db.row('new_val')(field));
const THREAD_LAST_ACTIVE_CHANGED = hasChanged('threadLastActive');

const getUpdatedDirectMessageThreadChangefeed = () =>
  db
    .table('directMessageThreads')
    .changes({
      includeInitial: false,
    })
    .filter(NEW_DOCUMENTS.or(THREAD_LAST_ACTIVE_CHANGED))('new_val')
    .run();

const listenToUpdatedDirectMessageThreadRecords = (cb: Function) => {
  return createChangefeed(
    getUpdatedDirectMessageThreadChangefeed,
    cb,
    'listenToUpdatedDirectMessageThreads'
  );
};

const listenToUpdatedDirectMessageThreads = (cb: Function): Function => {
  // NOTE(@mxstbr): Running changefeeds on eqJoin's does not work well, so we
  // hack around that by listening to record changes and then "faking" an eqJoin
  // by doing another db query!
  return listenToUpdatedDirectMessageThreadRecords(directMessageThread => {
    getDirectMessageThreadRecords(directMessageThread.id).then(
      usersDirectMessageThread => {
        usersDirectMessageThread.forEach(userDirectMessageThread => {
          cb({
            ...userDirectMessageThread,
            ...directMessageThread,
          });
        });
      }
    );
  });
};

// prettier-ignore
const checkForExistingDMThread = async (participants: Array<string>): Promise<?string> => {
  // return a list of all threadIds where both participants are active
  let idsToCheck = await db
    .table('usersDirectMessageThreads')
    .getAll(...participants, { index: 'userId' })
    .group('threadId')
    .map(row => row('userId'))
    .ungroup()
    .filter(row =>
      row('reduction')
        .count()
        .eq(participants.length)
    )
    .pluck('group')
    .run();

  if (!idsToCheck || idsToCheck.length === 0) return null;

  // return only the thread Ids
  idsToCheck = idsToCheck.map(row => row.group);

  // given a list of threads where both users are active (includes all groups)
  // return only threads where these exact participants are used
  return await db
    .table('usersDirectMessageThreads')
    .getAll(...idsToCheck, { index: 'threadId' })
    .group('threadId')
    .ungroup()
    .filter(row =>
      row('reduction')
        .count()
        .eq(participants.length)
    )
    .pluck('group')
    .map(row => row('group'))
    .run()
    .then(results => (results && results.length > 0 ? results[0] : null));
};

module.exports = {
  createDirectMessageThread,
  getDirectMessageThread,
  getDirectMessageThreads,
  getDirectMessageThreadsByUser,
  setDirectMessageThreadLastActive,
  listenToUpdatedDirectMessageThreads,
  checkForExistingDMThread,
};
