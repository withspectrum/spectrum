// @flow
const debug = require('debug')('vulcan:utils');
import { db } from './db';
import type {
  DBThread,
  DBUser,
  DBCommunity,
  DBMessage,
  SearchThread,
  SearchUser,
  SearchCommunity,
} from 'shared/types';
import { getThreadById } from './thread';
import { getLengthInBytes } from 'shared/string-byte-length';
import { toPlainText, toState } from 'shared/draft-utils';
import {
  getWordCount,
  withoutStopWords,
  onlyContainsEmoji,
} from './text-parsing';

export const dbThreadToSearchThread = (thread: DBThread): SearchThread => {
  let title = thread.content.title;
  let body =
    thread.type === 'DRAFTJS'
      ? thread.content.body
        ? toPlainText(toState(JSON.parse(thread.content.body)))
        : ''
      : thread.content.body || '';

  // filter out stop words
  body = withoutStopWords(body);
  // filter out stop words
  title = withoutStopWords(title);

  // algolia only supports 20kb records
  // slice it down until its under 19k, leaving room for the rest of the thread data
  while (getLengthInBytes(body) >= 19000) {
    body = body.slice(0, -100);
  }

  return {
    channelId: thread.channelId,
    communityId: thread.communityId,
    creatorId: thread.creatorId,
    lastActive: new Date(thread.lastActive).getTime(),
    threadId: thread.id,
    messageContent: {
      body: '',
    },
    threadContent: {
      title,
      body,
    },
    objectID: thread.id,
    createdAt: new Date(thread.createdAt).getTime(),
  };
};

const filterMessageString = (message: DBMessage): ?string => {
  // don't index photo uploads
  if (message.messageType === 'media') {
    debug('message was media, dont send');
    return null;
  }

  // don't index dms
  if (message.threadType === 'directMessageThread') {
    debug('message was in dm, dont send');
    return null;
  }

  // don't index emoji messages
  let messageString =
    message.messageType &&
    message.messageType === 'draftjs' &&
    toPlainText(toState(JSON.parse(message.content.body)));

  // if no string could be parsed
  if (!messageString || messageString.length === 0) {
    debug('message could not be parsed or was 0 characters');
    return null;
  }

  // if the message is only an emoji
  const emojiOnly = messageString && onlyContainsEmoji(messageString);
  if (emojiOnly) {
    debug('message was emoji only, dont send');
    return null;
  }

  // filter out stop words
  messageString = withoutStopWords(messageString);

  // don't index short messages - will eliminate things like
  // +1, nice, lol, cool, etc from being stored
  if (messageString && getWordCount(messageString) < 10) {
    debug('message was less than 10 significant words, dont send');
    return null;
  }

  while (getLengthInBytes(messageString) >= 19000) {
    messageString = messageString.slice(0, -100);
  }

  // passed all checks
  return messageString;
};

export const dbMessageToSearchThread = async (
  message: DBMessage
): Promise<?SearchThread> => {
  const messageString = filterMessageString(message);
  if (!messageString) return;

  const thread = await getThreadById(message.threadId);
  if (!thread || thread.deletedAt) return;

  return {
    channelId: thread.channelId,
    communityId: thread.communityId,
    creatorId: message.senderId,
    createdAt: new Date(thread.createdAt).getTime(),
    lastActive: new Date(thread.lastActive).getTime(),
    threadId: thread.id,
    messageContent: {
      body: messageString,
    },
    threadContent: {
      title: '',
      body: '',
    },
    objectID: message.id,
  };
};

export const dbUserToSearchUser = (user: DBUser): SearchUser => {
  let description = user.description;
  // filter out stop words
  description = description && withoutStopWords(description);

  return {
    name: user.name,
    username: user.username,
    description,
    website: user.website,
    id: user.id,
    objectID: user.id,
  };
};

export const dbCommunityToSearchCommunity = (
  community: DBCommunity
): SearchCommunity => {
  let description = community.description;
  // filter out stop words
  description = description && withoutStopWords(description);

  return {
    id: community.id,
    description,
    name: community.name,
    slug: community.slug,
    website: community.website ? community.website : null,
    objectID: community.id,
  };
};

export const NEW_DOCUMENTS = db
  .row('old_val')
  .eq(null)
  .and(db.not(db.row('new_val').eq(null)));

export const DELETED_DOCUMENTS = db
  .row('old_val')
  .hasFields('deletedAt')
  .not()
  .and(
    db
      .row('new_val')
      .hasFields('deletedAt')
      .and(
        db
          .row('new_val')('deletedAt')
          .ne(null)
      )
  );

export const hasChangedField = (field: string) =>
  db
    .row('old_val')(field)
    .ne(db.row('new_val')(field));

export const listenToNewDocumentsIn = (table: string, cb: Function) => {
  return db
    .table(table)
    .changes({
      includeInitial: false,
    })
    .filter(NEW_DOCUMENTS)
    .run({ cursor: true }, (err, cursor) => {
      if (err) throw err;
      cursor.each((err, data) => {
        if (err) throw err;
        // Call the passed callback with the new data
        cb(data.new_val);
      });
    });
};

export const listenToDeletedDocumentsIn = (table: string, cb: Function) => {
  return db
    .table(table)
    .changes({
      includeInitial: false,
    })
    .filter(DELETED_DOCUMENTS)
    .run({ cursor: true }, (err, cursor) => {
      if (err) throw err;
      cursor.each((err, data) => {
        if (err) throw err;
        // Call the passed callback with the new data
        cb(data.new_val);
      });
    });
};

export const listenToChangedFieldIn = (field: string) => (
  table: string,
  cb: Function
) => {
  const CHANGED_FIELD = hasChangedField(field);
  return db
    .table(table)
    .changes({
      includeInitial: false,
    })
    .filter(CHANGED_FIELD)
    .run({ cursor: true }, (err, cursor) => {
      if (err) throw err;
      cursor.each((err, data) => {
        if (err) throw err;
        // Call the passed callback with the new data
        cb(data.new_val);
      });
    });
};
