// @flow
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
import { byteCount } from './text-parsing';
import { toPlainText, toState } from 'shared/draft-utils';

export const dbThreadToSearchThread = (thread: DBThread): SearchThread => {
  const {
    content,
    watercooler,
    id,
    type,
    modifiedAt,
    edits,
    attachments,
    ...rest
  } = thread;
  let body =
    thread.type === 'DRAFTJS'
      ? thread.content.body
        ? toPlainText(toState(JSON.parse(thread.content.body)))
        : ''
      : thread.content.body || '';

  // algolia only supports 20kb records
  // slice it down until its under 19k, leaving room for the rest of the thread data
  while (byteCount(body) >= 19000) {
    body = body.slice(0, -100);
  }

  return {
    ...rest,
    createdAt: new Date(thread.createdAt).getTime() / 1000,
    lastActive: new Date(thread.lastActive).getTime() / 1000,
    threadId: thread.id,
    messageContent: {
      body: '',
    },
    threadContent: {
      ...thread.content,
      body,
    },
    objectID: thread.id,
  };
};

export const dbMessageToSearchThread = (message: DBMessage): SearchThread => {};

export const dbUserToSearchUser = (user: DBUser): SearchUser => {
  const {
    email,
    lastSeen,
    providerId,
    fbProviderId,
    googleProviderId,
    createdAt,
    isOnline,
    githubProviderId,
    timezone,
    modifiedAt,
    ...rest
  } = user;

  return {
    ...rest,
    objectID: user.id,
  };
};

export const dbCommunityToSearchCommunity = (
  community: DBCommunity
): SearchCommunity => {
  const { createdAt, pinnedThreadId, watercoolerId, ...rest } = community;
  return {
    ...rest,
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
      .and(db.row('new_val')('deletedAt').ne(null))
  );

export const hasChangedField = (field: string) =>
  db.row('old_val')(field).ne(db.row('new_val')(field));

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
