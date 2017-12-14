// @flow
const debug = require('debug')('vulcan:message');
const { db } = require('./db');
const env = require('node-env-file');
const path = require('path');
import { toPlainText, toState } from 'shared/draft-utils';
env(path.resolve(__dirname, '../.env'), { raise: false });
const IS_PROD = process.env.NODE_ENV === 'production';
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_API_SECRET = process.env.ALGOLIA_API_SECRET;
const algoliasearch = require('algoliasearch');
const algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_SECRET);
const threadsSearchIndex = algolia.initIndex(
  IS_PROD ? 'threads_and_messages' : 'dev_threads_and_messages'
);
import {
  getWordCount,
  withoutStopWords,
  withoutSwearWords,
  onlyContainsEmoji,
} from './text-parsing';
import {
  dbMessageToSearchThread,
  listenToNewDocumentsIn,
  listenToDeletedDocumentsIn,
  listenToChangedFieldIn,
} from './utils';

export const newMessage = () =>
  listenToNewDocumentsIn('messages', async data => {
    // don't index photo uploads
    if (data.messageType === 'media') return;

    // don't index dms
    if (data.threadType === 'directMessageThread') return;

    // don't index emoji messages
    let messageString =
      data.messageType &&
      data.messageType === 'draftjs' &&
      toPlainText(toState(JSON.parse(data.content.body)));
    const emojiOnly = messageString && onlyContainsEmoji(messageString);
    if (emojiOnly) return;

    // filter out stop words
    messageString = withoutStopWords(messageString);
    // filter out swear words
    messageString = withoutSwearWords(messageString);

    // don't index short messages - will eliminate things like
    // +1, nice, lol, cool, etc from being stored
    if (messageString && getWordCount(messageString) < 10) return;

    console.log('data', data);
    console.log('message string', messageString);
    // const searchableMessage = dbMessageToSearchThread(data);
    // return threadsSearchIndex.saveObject(searchableMessage, (err, obj) => {
    //   if (err) {
    //    debug('error indexing a thread');
    //    console.log(err)
    //   }
    //  debug('stored new thread in search');
    // });
  });

export const deletedThread = () =>
  listenToDeletedDocumentsIn('threads', data => {
    // something went wrong if it hits here and doesn't have a deleted field
    if (!data.deletedAt) return;
    return threadsSearchIndex.deleteObject(data.id, (err, obj) => {
      if (err) {
        debug('error deleting a thread');
        console.log(err);
      }
      debug('deleted thread in search');
    });
  });

export const movedThread = () =>
  listenToChangedFieldIn('channelId')('threads', async data => {
    const getAllRecordsForThreadId = data => {
      return new Promise((resolve, reject) => {
        return threadsSearchIndex.browse(
          {
            query: '',
            filters: `threadId:'${data.id}'`,
          },
          (err, content) => {
            if (err) {
              debug("couldn't find any results for this thread id");
              console.log(err);
              reject(err);
            }
            console.log('got hits');
            resolve(content.hits);
            return content.hits;
          }
        );
      });
    };

    const [hits] = await Promise.all([getAllRecordsForThreadId(data)]);

    if (!hits || hits.length === 0) return;

    const allRecords = hits.map(r => ({
      channelId: data.channelId,
      objectID: r.objectID,
    }));

    return threadsSearchIndex.partialUpdateObjects(allRecords, (err, obj) => {
      if (err) {
        debug('error moving channels for a thread');
        console.log(err);
      }
      debug('changed thread channels id in search');
    });
  });

export const editedThread = () =>
  listenToChangedFieldIn('modifiedAt')('threads', data => {
    const searchableThread = dbMessageToSearchThread(data);
    return threadsSearchIndex.partialUpdateObject(
      {
        objectID: data.id,
        threadContent: {
          ...searchableThread.threadContent,
        },
      },
      (err, obj) => {
        if (err) {
          debug('error saving edited thread');
          console.log(err);
        }
        debug('changed edited thread content in search');
      }
    );
  });
