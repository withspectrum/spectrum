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
import { toPlainText, toState } from 'shared/draft-utils';

const byteCount = str => {
  // returns the byte length of an utf8 string
  let s = str.length;
  for (let i = str.length - 1; i >= 0; i--) {
    let code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xdc00 && code <= 0xdfff) i--; //trail surrogate
  }
  return s;
};

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

export const dbUserToSearchUser = (user: DBUser): SearchUser => {};

export const dbCommunityToSearchCommunity = (
  community: DBCommunity
): SearchCommunity => {};

export const NEW_DOCUMENTS = db
  .row('old_val')
  .eq(null)
  .and(db.not(db.row('new_val').eq(null)));

export const HAS_CHANGED = (field: string) =>
  db.row('old_val')(field).ne(db.row('new_val')(field));

export const listenToNewDocumentsIn = (table: string, cb: Function) => {
  return (
    db
      .table(table)
      .changes({
        includeInitial: false,
      })
      // Filter to only include newly inserted messages in the changefeed
      .filter(NEW_DOCUMENTS)
      .run({ cursor: true }, (err, cursor) => {
        if (err) throw err;
        cursor.each((err, data) => {
          if (err) throw err;
          // Call the passed callback with the new data
          cb(data.new_val);
        });
      })
  );
};
