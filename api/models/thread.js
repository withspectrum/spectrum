// @flow
const { db } = require('shared/db');
import intersection from 'lodash.intersection';
import { processReputationEventQueue, searchQueue } from 'shared/bull/queues';
const { parseRange, NEW_DOCUMENTS } = require('./utils');
import { createChangefeed } from 'shared/changefeed-utils';
import { deleteMessagesInThread } from '../models/message';
import { turnOffAllThreadNotifications } from '../models/usersThreads';
import type { PaginationOptions } from '../utils/paginate-arrays';
import type { DBThread, FileUpload } from 'shared/types';
import type { Timeframe } from './utils';

const NOT_WATERCOOLER = thread =>
  db.not(thread.hasFields('watercooler')).or(thread('watercooler').eq(false));

export const getThread = (threadId: string): Promise<DBThread> => {
  return db
    .table('threads')
    .get(threadId)
    .run();
};

// prettier-ignore
export const getThreads = (threadIds: Array<string>): Promise<Array<DBThread>> => {
  return db
    .table('threads')
    .getAll(...threadIds)
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .run();
};

export const getThreadById = (threadId: string): Promise<?DBThread> => {
  return db
    .table('threads')
    .getAll(threadId)
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .run()
    .then(results => {
      if (!results || results.length === 0) return null;
      return results[0];
    });
};

// this is used to get all threads that need to be marked as deleted whenever a channel is deleted
export const getThreadsByChannelToDelete = (channelId: string) => {
  return db
    .table('threads')
    .getAll(channelId, { index: 'channelId' })
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .run();
};

// prettier-ignore
export const getThreadsByChannel = (channelId: string, options: PaginationOptions): Promise<Array<DBThread>> => {
  const { first, after } = options

  return db
    .table('threads')
    .between(
      [channelId, db.minval],
      [channelId, after ? new Date(after) : db.maxval],
      {
        index: 'channelIdAndLastActive',
        leftBound: 'open',
        rightBound: 'open',
      }
    )
    .orderBy({ index: db.desc('channelIdAndLastActive') })
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .limit(first)
    .run();
};

// prettier-ignore
type GetThreadsByChannelPaginationOptions = {
  first: number,
  after: number,
  sort: 'latest' | 'trending'
};

export const getThreadsByChannels = (
  channelIds: Array<string>,
  options: GetThreadsByChannelPaginationOptions
): Promise<Array<DBThread>> => {
  const { first, after, sort = 'latest' } = options;

  let order = [db.desc('lastActive'), db.desc('createdAt')];
  // If we want the top threads, first sort by the score and then lastActive
  if (sort === 'trending') order.unshift(db.desc('score'));

  return db
    .table('threads')
    .getAll(...channelIds, { index: 'channelId' })
    .filter(thread =>
      db.not(thread.hasFields('deletedAt')).and(NOT_WATERCOOLER(thread))
    )
    .orderBy(...order)
    .skip(after || 0)
    .limit(first || 999999)
    .run();
};

// prettier-ignore
export const getThreadsByCommunity = (communityId: string): Promise<Array<DBThread>> => {
  return db
    .table('threads')
    .between([communityId, db.minval], [communityId, db.maxval], {
      index: 'communityIdAndLastActive',
      leftBound: 'open',
      rightBound: 'open',
    })
    .orderBy({ index: db.desc('communityIdAndLastActive') })
    .filter(thread => db.not(thread.hasFields('deletedAt')).and(NOT_WATERCOOLER(thread)))
    .run();
};

// prettier-ignore
export const getThreadsByCommunityInTimeframe = (communityId: string, range: Timeframe): Promise<Array<Object>> => {
  const { current } = parseRange(range);
  return db
    .table('threads')
    .getAll(communityId, { index: 'communityId' })
    .filter(db.row('createdAt').during(db.now().sub(current), db.now()))
    .filter(thread => db.not(thread.hasFields('deletedAt')).and(NOT_WATERCOOLER(thread)))
    .run();
};

// prettier-ignore
export const getThreadsInTimeframe = (range: Timeframe): Promise<Array<Object>> => {
  const { current } = parseRange(range);
  return db
    .table('threads')
    .filter(db.row('createdAt').during(db.now().sub(current), db.now()))
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .run();
};

// We do not filter by deleted threads intentionally to prevent users from spam
// creating/deleting threads
// prettier-ignore
export const getThreadsByUserAsSpamCheck = (userId: string, timeframe: number = 60 * 10): Promise<Array<?DBThread>> => {
  return db
    .table('threads')
    .getAll(userId, { index: 'creatorId' })
    .filter(db.row('createdAt').during(db.now().sub(timeframe), db.now()))
    .run();
};

/*
  When viewing a user profile we have to take two arguments into account:
  1. The user who is being viewed
  2. The user who is doing the viewing

  We need to return only threads that meet the following criteria:
  1. The thread was posted to a public channel
  2. The thread was posted to a private channel and the viewing user is a member
*/
export const getViewableThreadsByUser = async (
  evalUser: string,
  currentUser: string,
  options: PaginationOptions
): Promise<Array<DBThread>> => {
  const { first, after } = options;
  // get a list of the channelIds the current user is allowed to see threads
  const getCurrentUsersChannelIds = db
    .table('usersChannels')
    .getAll(
      [currentUser, 'member'],
      [currentUser, 'moderator'],
      [currentUser, 'owner'],
      {
        index: 'userIdAndRole',
      }
    )
    .map(userChannel => userChannel('channelId'))
    .run();

  const getCurrentUserCommunityIds = db
    .table('usersCommunities')
    .getAll([currentUser, true], { index: 'userIdAndIsMember' })
    .map(userCommunity => userCommunity('communityId'))
    .run();

  // get a list of the channels where the user posted a thread
  const getPublishedChannelIds = db
    .table('threads')
    .getAll(evalUser, { index: 'creatorId' })
    .map(thread => thread('channelId'))
    .run();

  const getPublishedCommunityIds = db
    .table('threads')
    .getAll(evalUser, { index: 'creatorId' })
    .map(thread => thread('communityId'))
    .run();

  const [
    currentUsersChannelIds,
    publishedChannelIds,
    currentUsersCommunityIds,
    publishedCommunityIds,
  ] = await Promise.all([
    getCurrentUsersChannelIds,
    getPublishedChannelIds,
    getCurrentUserCommunityIds,
    getPublishedCommunityIds,
  ]);

  // get a list of all the channels that are public
  const publicChannelIds = await db
    .table('channels')
    .getAll(...publishedChannelIds)
    .filter({ isPrivate: false })
    .map(channel => channel('id'))
    .run();

  const publicCommunityIds = await db
    .table('communities')
    .getAll(...publishedCommunityIds)
    .filter({ isPrivate: false })
    .map(community => community('id'))
    .run();

  const allIds = [
    ...currentUsersChannelIds,
    ...currentUsersCommunityIds,
    ...publicChannelIds,
    ...publicCommunityIds,
  ];
  const distinctIds = allIds.filter((x, i, a) => a.indexOf(x) === i);
  let validChannelIds = intersection(distinctIds, publishedChannelIds);
  let validCommunityIds = intersection(distinctIds, publishedCommunityIds);

  // takes ~70ms for a heavy load
  return await db
    .table('threads')
    .getAll(evalUser, { index: 'creatorId' })
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .filter(thread => db.expr(validChannelIds).contains(thread('channelId')))
    .filter(thread =>
      db.expr(validCommunityIds).contains(thread('communityId'))
    )
    .orderBy(db.desc('lastActive'), db.desc('createdAt'))
    .skip(after || 0)
    .limit(first)
    .run()
    .then(res => {
      return res;
    });
};

// prettier-ignore
export const getPublicThreadsByUser = (evalUser: string, options: PaginationOptions): Promise<Array<DBThread>> => {
  const { first, after } = options
  return db
    .table('threads')
    .getAll(evalUser, { index: 'creatorId' })
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .eqJoin('channelId', db.table('channels'))
    .filter({ right: { isPrivate: false } })
    .without('right')
    .zip()
    .eqJoin('communityId', db.table('communities'))
    .filter({ right: { isPrivate: false } })
    .without('right')
    .zip()
    .orderBy(db.desc('lastActive'), db.desc('createdAt'))
    .skip(after || 0)
    .limit(first || 10)
    .run();
};

export const getViewableParticipantThreadsByUser = async (
  evalUser: string,
  currentUser: string,
  options: PaginationOptions
): Promise<Array<DBThread>> => {
  const { first, after } = options;
  // get a list of the channelIds the current user is allowed to see threads for
  const getCurrentUsersChannelIds = db
    .table('usersChannels')
    .getAll(
      [currentUser, 'member'],
      [currentUser, 'moderator'],
      [currentUser, 'owner'],
      {
        index: 'userIdAndRole',
      }
    )
    .map(userChannel => userChannel('channelId'))
    .run();

  const getCurrentUserCommunityIds = db
    .table('usersCommunities')
    .getAll([currentUser, true], { index: 'userIdAndIsMember' })
    .map(userCommunity => userCommunity('communityId'))
    .run();

  // get a list of the channels where the user participated in a thread
  const getParticipantChannelIds = db
    .table('usersThreads')
    .getAll([evalUser, true], { index: 'userIdAndIsParticipant' })
    .eqJoin('threadId', db.table('threads'))
    .zip()
    .pluck('channelId', 'threadId')
    .run();

  const getParticipantCommunityIds = db
    .table('usersThreads')
    .getAll([evalUser, true], { index: 'userIdAndIsParticipant' })
    .eqJoin('threadId', db.table('threads'))
    .zip()
    .pluck('communityId', 'threadId')
    .run();

  const [
    currentUsersChannelIds,
    participantChannelIds,
    currentUsersCommunityIds,
    participantCommunityIds,
  ] = await Promise.all([
    getCurrentUsersChannelIds,
    getParticipantChannelIds,
    getCurrentUserCommunityIds,
    getParticipantCommunityIds,
  ]);

  const participantThreadIds = participantChannelIds.map(c => c && c.threadId);
  const distinctParticipantChannelIds = participantChannelIds
    .map(c => c.channelId)
    .filter((x, i, a) => a.indexOf(x) === i);

  const distinctParticipantCommunityIds = participantCommunityIds
    .map(c => c.communityId)
    .filter((x, i, a) => a.indexOf(x) === i);

  // get a list of all the channels that are public
  const publicChannelIds = await db
    .table('channels')
    .getAll(...distinctParticipantChannelIds)
    .filter({ isPrivate: false })
    .map(channel => channel('id'))
    .run();

  const publicCommunityIds = await db
    .table('communities')
    .getAll(...distinctParticipantCommunityIds)
    .filter({ isPrivate: false })
    .map(community => community('id'))
    .run();

  const allIds = [
    ...currentUsersChannelIds,
    ...publicChannelIds,
    ...currentUsersCommunityIds,
    ...publicCommunityIds,
  ];
  const distinctIds = allIds.filter((x, i, a) => a.indexOf(x) === i);
  let validChannelIds = intersection(
    distinctIds,
    distinctParticipantChannelIds
  );
  let validCommunityIds = intersection(
    distinctIds,
    distinctParticipantCommunityIds
  );

  return await db
    .table('threads')
    .getAll(...participantThreadIds)
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .filter(thread => db.expr(validChannelIds).contains(thread('channelId')))
    .filter(thread =>
      db.expr(validCommunityIds).contains(thread('communityId'))
    )
    .orderBy(db.desc('lastActive'), db.desc('createdAt'))
    .skip(after || 0)
    .limit(first)
    .run()
    .then(res => {
      return res;
    });
};

// prettier-ignore
export const getPublicParticipantThreadsByUser = (evalUser: string, options: PaginationOptions): Promise<Array<DBThread>> => {
  const { first, after } = options
  return db
    .table('usersThreads')
    .getAll([evalUser, true], { index: 'userIdAndIsParticipant' })
    .eqJoin('threadId', db.table('threads'))
    .without({
      left: [
        'id',
        'userId',
        'threadId',
        'createdAt',
        'isParticipant',
        'receiveNotifications',
      ],
    })
    .zip()
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .eqJoin('channelId', db.table('channels'))
    .filter({ right: { isPrivate: false } })
    .without('right')
    .zip()
    .eqJoin('communityId', db.table('communities'))
    .filter({ right: { isPrivate: false } })
    .without('right')
    .zip()
    .orderBy(db.desc('lastActive'), db.desc('createdAt'))
    .skip(after || 0)
    .limit(first || 10)
    .run()
    .then(res => {
      return res;
    });
};

export const getWatercoolerThread = (
  communityId: string
): Promise<?DBThread> => {
  return db
    .table('threads')
    .getAll([communityId, true], { index: 'communityIdAndWatercooler' })
    .run()
    .then(result => {
      if (!Array.isArray(result) || result.length === 0) return null;
      return result[0];
    });
};

export const publishThread = (
  // eslint-disable-next-line
  { filesToUpload, ...thread }: Object,
  userId: string
): Promise<DBThread> => {
  return db
    .table('threads')
    .insert(
      Object.assign({}, thread, {
        creatorId: userId,
        createdAt: new Date(),
        lastActive: new Date(),
        modifiedAt: null,
        isPublished: true,
        isLocked: false,
        edits: [],
        reactionCount: 0,
        messageCount: 0,
      }),
      { returnChanges: true }
    )
    .run()
    .then(result => {
      const thread = result.changes[0].new_val;

      searchQueue.add({
        id: thread.id,
        type: 'thread',
        event: 'created',
      });

      return thread;
    });
};

// prettier-ignore
export const setThreadLock = (threadId: string, value: boolean, userId: string, byModerator: boolean = false): Promise<DBThread> => {
  return (
    db
      .table('threads')
      .get(threadId)
      // Note(@mxstbr): There surely is a better way to toggle a bool
      // with ReQL, I just couldn't find the API for it in a pinch
      .update(
        {
          isLocked: value,
          lockedBy: value === true ? userId : db.literal(),
          lockedAt: value === true ? new Date() : db.literal(),
        },
        { returnChanges: true }
      )
      .run()
      .then(async () => {
        const thread = await getThreadById(threadId)
        return thread
      })
  );
};

export const setThreadLastActive = (threadId: string, value: Date) => {
  return db
    .table('threads')
    .get(threadId)
    .update({ lastActive: value })
    .run();
};

// prettier-ignore
export const deleteThread = (threadId: string, userId: string): Promise<Boolean> => {
  return db
    .table('threads')
    .get(threadId)
    .update(
      {
        deletedBy: userId,
        deletedAt: new Date(),
      },
      {
        returnChanges: true,
        nonAtomic: true,
      }
    )
    .run()
    .then(result =>
      Promise.all([
        result,
        turnOffAllThreadNotifications(threadId),
        deleteMessagesInThread(threadId, userId),
      ])
    )
    .then(([result]) => {
      const thread = result.changes[0].new_val;

      searchQueue.add({
        id: thread.id,
        type: 'thread',
        event: 'deleted'
      })

      processReputationEventQueue.add({
        userId: thread.creatorId,
        type: 'thread deleted',
        entityId: thread.id,
      });

      return result.replaced >= 1 ? true : false;
    });
};

type File = FileUpload;

export type EditThreadInput = {
  threadId: string,
  content: {
    title: string,
    body: ?string,
  },
  filesToUpload?: ?Array<File>,
};

// shouldUpdate arguemnt is used to prevent a thread from being marked as edited when the images are uploaded at publish time
// prettier-ignore
export const editThread = (input: EditThreadInput, userId: string, shouldUpdate: boolean = true): Promise<DBThread> => {
  return db
    .table('threads')
    .get(input.threadId)
    .update(
      {
        content: input.content,
        modifiedAt: shouldUpdate ? new Date() : null,
        editedBy: userId,
        edits: db.row('edits').append({
          content: db.row('content'),
          timestamp: new Date(),
          editedBy: db.row('editedBy').default(db.row('creatorId'))
        }),
      },
      { returnChanges: 'always' }
    )
    .run()
    .then(result => {
      // if an update happened
      if (result.replaced === 1) {
        const thread = result.changes[0].new_val;

        searchQueue.add({
          id: thread.id,
          type: 'thread',
          event: 'edited'
        })

        return thread;
      }

      // an update was triggered from the client, but no data was changed
      return result.changes[0].old_val;
    });
};

export const updateThreadWithImages = (id: string, body: string) => {
  return db
    .table('threads')
    .get(id)
    .update(
      {
        content: {
          body,
        },
      },
      { returnChanges: 'always' }
    )
    .run()
    .then(result => {
      // if an update happened
      if (result.replaced === 1) {
        return result.changes[0].new_val;
      }

      // no data was changed
      if (result.unchanged === 1) {
        return result.changes[0].old_val;
      }

      return null;
    });
};

export const moveThread = (id: string, channelId: string) => {
  return db
    .table('threads')
    .get(id)
    .update(
      {
        channelId,
      },
      { returnChanges: 'always' }
    )
    .run()
    .then(result => {
      if (result.replaced === 1) {
        const thread = result.changes[0].new_val;

        searchQueue.add({
          id: thread.id,
          type: 'thread',
          event: 'moved',
        });

        return thread;
      }

      return null;
    });
};

export const incrementMessageCount = (threadId: string) => {
  return db
    .table('threads')
    .get(threadId)
    .update({
      messageCount: db
        .row('messageCount')
        .default(0)
        .add(1),
    })
    .run();
};

export const decrementMessageCount = (threadId: string) => {
  return db
    .table('threads')
    .get(threadId)
    .update({
      messageCount: db
        .row('messageCount')
        .default(1)
        .sub(1),
    })
    .run();
};

export const incrementReactionCount = (threadId: string) => {
  return db
    .table('threads')
    .get(threadId)
    .update({
      reactionCount: db
        .row('reactionCount')
        .default(0)
        .add(1),
    })
    .run();
};

export const decrementReactionCount = (threadId: string) => {
  return db
    .table('threads')
    .get(threadId)
    .update({
      reactionCount: db
        .row('reactionCount')
        .default(1)
        .sub(1),
    })
    .run();
};

const hasChanged = (field: string) =>
  db
    .row('old_val')(field)
    .ne(db.row('new_val')(field));

const getUpdatedThreadsChangefeed = () =>
  db
    .table('threads')
    .changes({
      includeInitial: false,
    })
    .filter(
      NEW_DOCUMENTS.or(
        hasChanged('content')
          .or(hasChanged('lastActive'))
          .or(hasChanged('channelId'))
          .or(hasChanged('communityId'))
          .or(hasChanged('creatorId'))
          .or(hasChanged('isPublished'))
          .or(hasChanged('modifiedAt'))
          .or(hasChanged('messageCount'))
          .or(hasChanged('reactionCount'))
      )
    )('new_val')
    .run();

export const listenToUpdatedThreads = (cb: Function): Function => {
  return createChangefeed(
    getUpdatedThreadsChangefeed,
    cb,
    'listenToUpdatedThreads'
  );
};
