//@flow
const { db } = require('shared/db');
import {
  sendMessageNotificationQueue,
  sendDirectMessageNotificationQueue,
  processReputationEventQueue,
  _adminProcessToxicMessageQueue,
  searchQueue,
} from 'shared/bull/queues';
import { NEW_DOCUMENTS } from './utils';
import { createChangefeed } from 'shared/changefeed-utils';
import {
  setThreadLastActive,
  incrementMessageCount,
  decrementMessageCount,
} from './thread';
import type { DBMessage } from 'shared/types';

export type MessageTypes = 'text' | 'media';

export const getMessage = (messageId: string): Promise<DBMessage> => {
  return db
    .table('messages')
    .get(messageId)
    .run()
    .then(message => {
      if (!message || message.deletedAt) return null;
      return message;
    });
};

export const getManyMessages = (messageIds: string[]): Promise<DBMessage[]> => {
  return db
    .table('messages')
    .getAll(...messageIds)
    .run()
    .then(messages => {
      return messages.filter(message => message && !message.deletedAt);
    });
};

type BackwardsPaginationOptions = { last?: number, before?: number | Date };

// prettier-ignore
const getBackwardsMessages = (threadId: string, { last, before }: BackwardsPaginationOptions) => {
  return db
    .table('messages')
    .between(
      [threadId, db.minval],
      [threadId, before ? new Date(before) : db.maxval],
      { index: 'threadIdAndTimestamp' }
    )
    .orderBy({ index: db.desc('threadIdAndTimestamp') })
    .filter(db.row.hasFields('deletedAt').not())
    .limit(last || 0)
    .run();
};

type ForwardsPaginationOptions = { first?: number, after?: number | Date };

// prettier-ignore
const getForwardMessages = (threadId: string, { first, after }: ForwardsPaginationOptions) => {
  return db
    .table('messages')
    .between(
      [threadId, after ? new Date(after) : db.minval],
      [threadId, db.maxval],
      { index: 'threadIdAndTimestamp', leftBound: 'open', rightBound: 'closed' }
    )
    .orderBy({ index: 'threadIdAndTimestamp' })
    .filter(db.row.hasFields('deletedAt').not())
    .limit(first || 0)
    .run();
};

export const getMessages = (
  threadId: string,
  {
    first,
    after,
    last,
    before,
  }: { ...BackwardsPaginationOptions, ...ForwardsPaginationOptions }
): Promise<Array<DBMessage>> => {
  // $FlowIssue
  if (last || before) return getBackwardsMessages(threadId, { last, before });
  // $FlowIssue
  return getForwardMessages(threadId, { first, after });
};

export const getLastMessage = (threadId: string): Promise<?DBMessage> => {
  return db
    .table('messages')
    .between([threadId, db.minval], [threadId, db.maxval], {
      index: 'threadIdAndTimestamp',
      leftBound: 'open',
      rightBound: 'closed',
    })
    .orderBy({ index: db.desc('threadIdAndTimestamp') })
    .filter(db.row.hasFields('deletedAt').not())
    .limit(1)
    .run()
    .then(res => (Array.isArray(res) && res.length > 0 ? res[0] : null));
};

export const getLastMessageOfThreads = (
  threadIds: Array<string>
): Promise<Array<?DBMessage>> => {
  return Promise.all(threadIds.map(id => getLastMessage(id)));
};

// prettier-ignore
export const getMediaMessagesForThread = (threadId: string): Promise<Array<DBMessage>> => {
  return db
    .table('messages')
    .getAll(threadId, { index: 'threadId' })
    .filter({ messageType: 'media' })
    .filter(db.row.hasFields('deletedAt').not())
    .run();
};

// prettier-ignore
export const storeMessage = (message: Object, userId: string): Promise<DBMessage> => {
  // Insert a message
  return db
    .table('messages')
    .insert(
      Object.assign({}, message, {
        timestamp: new Date(),
        senderId: userId,
        content: {
          body:
            message.messageType === 'media'
              ? message.content.body
              : // For text messages linkify URLs and strip HTML tags
                message.content.body,
        },
      }),
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val)
    .then(async message => {
      if (message.threadType === 'directMessageThread') {
        await Promise.all([
          sendDirectMessageNotificationQueue.add({ message, userId }),
        ])
      }

      if (message.threadType === 'story') {
        await Promise.all([
        sendMessageNotificationQueue.add({ message }),
        searchQueue.add({
          id: message.id,
          type: 'message',
          event: 'created'
        }),
        processReputationEventQueue.add({
          userId,
          type: 'message created',
          entityId: message.threadId,
        }),
        _adminProcessToxicMessageQueue.add({ message }),

          setThreadLastActive(message.threadId, message.timestamp),
          incrementMessageCount(message.threadId)
        ])
      }

      return message;
    });
};

const getNewMessageChangefeed = () =>
  db
    .table('messages')
    .changes({
      includeInitial: false,
    })
    .filter(NEW_DOCUMENTS)('new_val')
    .run();

export const listenToNewMessages = (cb: Function): Function => {
  return createChangefeed(getNewMessageChangefeed, cb, 'listenToNewMessages');
};

export const getMessageCount = (threadId: string): Promise<number> => {
  return db
    .table('messages')
    .getAll(threadId, { index: 'threadId' })
    .filter(db.row.hasFields('deletedAt').not())
    .count()
    .run();
};

// prettier-ignore
export const getMessageCountInThreads = (threadIds: Array<string>): Promise<Array<mixed>> => {
  return db
    .table('messages')
    .getAll(...threadIds, { index: 'threadId' })
    .filter(db.row.hasFields('deletedAt').not())
    .group('threadId')
    .count()
    .run();
};

export const deleteMessage = (userId: string, messageId: string) => {
  return db
    .table('messages')
    .get(messageId)
    .update(
      {
        deletedBy: userId,
        deletedAt: new Date(),
      },
      { returnChanges: 'always' }
    )
    .run()
    .then(result => result.changes[0].new_val || result.changes[0].old_val)
    .then(async message => {
      await Promise.all([
        processReputationEventQueue.add({
          userId,
          type: 'message deleted',
          entityId: messageId,
        }),
        message.threadType === 'story'
          ? decrementMessageCount(message.threadId)
          : Promise.resolve(),
        message.threadType === 'story'
          ? searchQueue.add({
              id: message.id,
              type: 'message',
              event: 'deleted',
            })
          : Promise.resolve(),
      ]);

      return message;
    });
};

// prettier-ignore
export const deleteMessagesInThread = async (threadId: string, userId: string) => {
  const messages = await db
    .table('messages')
    .getAll(threadId, { index: 'threadId' })
    .run();

  if (!messages || messages.length === 0) return;

  const searchPromises = messages.map(message => {
    if (message.threadType !== 'story') return null
    return searchQueue.add({
      id: message.id,
      type: 'message',
      event: 'deleted'
    })
  })

  const deletePromise = db
    .table('messages')
    .getAll(threadId, { index: 'threadId' })
    .update({
      deletedBy: userId,
      deletedAt: new Date(),
    })
    .run();

  return await Promise.all([
    deletePromise,
    ...searchPromises
  ]).then(() => {
    return Promise.all(Array.from({ length: messages.length }).map(() => decrementMessageCount(threadId)))
  });
};

export const userHasMessagesInThread = (threadId: string, userId: string) => {
  return db
    .table('messages')
    .getAll(threadId, { index: 'threadId' })
    .filter(db.row.hasFields('deletedAt').not())('senderId')
    .contains(userId)
    .run();
};

type EditInput = {
  id: string,
  content: {
    body: string,
  },
};

// prettier-ignore
export const editMessage = (message: EditInput): Promise<DBMessage> => {
  // Insert a message
  return db
    .table('messages')
    .get(message.id)
    .update(
      {
        content: message.content,
        modifiedAt: new Date(),
        edits: db.branch(
          db.row.hasFields('edits'), 
          db.row('edits').append({
            content: db.row('content'),
            timestamp: db.row('modifiedAt'),
          }),
          [{ 
            content: db.row('content'), 
            timstamp: db.row('timestamp')
          }]
        ),
      },
      { returnChanges: 'always' }
    )
    .run()
    .then(result => result.changes[0].new_val || result.changes[0].old_val)
    .then(message => {
      if (message.threadType === 'story') {
        searchQueue.add({
          id: message.id,
          type: 'message',
          event: 'edited'
        })
      }

      return message;
    });
};
