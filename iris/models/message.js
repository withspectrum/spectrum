//@flow
const { db } = require('./db');
import { addQueue } from '../utils/workerQueue';
const { listenToNewDocumentsIn } = require('./utils');
const { setThreadLastActive } = require('./thread');

export type MessageTypes = 'text' | 'media';
// TODO: Fix this
export type Message = Object;

export const getMessage = (messageId: string): Promise<Message> => {
  return db
    .table('messages')
    .get(messageId)
    .run()
    .then(message => {
      if (!message || message.deletedAt) return null;
      return message;
    });
};

type BackwardsPaginationOptions = { last?: number, before?: number | Date };

const getBackwardsMessages = (
  threadId: string,
  { last, before }: BackwardsPaginationOptions
) => {
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

const getForwardMessages = (
  threadId: string,
  { first, after }: ForwardsPaginationOptions
) => {
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
): Promise<Array<Message>> => {
  if (last || before) return getBackwardsMessages(threadId, { last, before });
  return getForwardMessages(threadId, { first, after });
};

export const getLastMessage = (threadId: string): Promise<Message> => {
  return db
    .table('messages')
    .getAll(threadId, { index: 'threadId' })
    .filter(db.row.hasFields('deletedAt').not())
    .max('timestamp')
    .run();
};

export const getLastMessages = (threadIds: Array<string>): Promise<Object> => {
  return db
    .table('messages')
    .getAll(...threadIds, { index: 'threadId' })
    .filter(db.row.hasFields('deletedAt').not())
    .group('threadId')
    .max(row => row('timestamp'))
    .run();
};

export const getMediaMessagesForThread = (
  threadId: string
): Promise<Array<Message>> => {
  return getMessages(threadId, {}).then(messages =>
    messages.filter(({ messageType }) => messageType === 'media')
  );
};

export const storeMessage = (
  message: Message,
  userId: string
): Promise<Message> => {
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
    .then(message => {
      if (message.threadType === 'directMessageThread') {
        addQueue('direct message notification', { message, userId });
      }

      if (message.threadType === 'story') {
        addQueue('process admin toxic message', { message });
        addQueue('message notification', { message, userId });
        addQueue('process reputation event', {
          userId,
          type: 'message created',
          entityId: message.threadId,
        });

        setThreadLastActive(message.threadId, message.timestamp);
      }

      return message;
    });
};

export const listenToNewMessages = (cb: Function): Function => {
  return listenToNewDocumentsIn('messages', cb);
};

export const getMessageCount = (threadId: string): Promise<number> => {
  return db
    .table('messages')
    .getAll(threadId, { index: 'threadId' })
    .filter(db.row.hasFields('deletedAt').not())
    .count()
    .run();
};

export const getMessageCountInThreads = (
  threadIds: Array<string>
): Promise<Array<mixed>> => {
  return db
    .table('messages')
    .getAll(...threadIds, { index: 'threadId' })
    .filter(db.row.hasFields('deletedAt').not())
    .group('threadId')
    .count()
    .run();
};

export const deleteMessage = (userId: string, id: string) => {
  return db
    .table('messages')
    .get(id)
    .update({
      deletedAt: new Date(),
    })
    .run()
    .then(res => {
      addQueue('process reputation event', {
        userId,
        type: 'message deleted',
        entityId: id,
      });
      return res;
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
