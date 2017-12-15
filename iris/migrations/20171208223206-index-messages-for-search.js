require('now-env');
const initIndex = require('shared/algolia');
const searchIndex = initIndex('threads_and_messages');
const { toPlainText, toState } = require('shared/draft-utils');
const stopword = require('stopword');
const Filter = require('bad-words');
const filter = new Filter({ placeHolder: ' ' });

import createEmojiRegex from 'emoji-regex';

// This regex matches every string with any emoji in it, not just strings that only have emojis
const originalEmojiRegex = createEmojiRegex();
// Make sure we match strings that only contain emojis (and whitespace)
const regex = new RegExp(
  `^(${originalEmojiRegex.toString().replace(/\/g$/, '')}|\\s)+$`
);
const onlyContainsEmoji = text => regex.test(text);

const strToArray = str => {
  // turn the string into an array of words
  return (
    str
      .split(' ')
      // remove any space characters
      .filter(n => n.length > 0)
      // remove any newline characters
      .filter(n => n !== '\n')
  );
};

const getWordCount = str => {
  const arr = strToArray(str);
  return arr.length;
};

const withoutStopWords = str => {
  // turn the string into an array of words
  const arr = strToArray(str);
  // filter out any words that are considered stop words
  const cleaned = stopword.removeStopwords(arr);
  // join the array back into a string
  const joined = cleaned.join(' ');
  // return the string
  return joined;
};

const withoutSwearWords = str => filter.clean(str);

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

const filterMessageString = message => {
  // don't index photo uploads
  if (message.messageType === 'media') {
    return null;
  }

  // don't index dms
  if (message.threadType === 'directMessageThread') {
    return null;
  }

  // don't index emoji messages
  let messageString =
    message.messageType === 'draftjs'
      ? message.content.body
        ? toPlainText(toState(JSON.parse(message.content.body)))
        : ''
      : message.content.body || '';

  // if no string could be parsed
  if (!messageString || messageString.length === 0) {
    return null;
  }

  // if the message is only an emoji
  const emojiOnly = messageString && onlyContainsEmoji(messageString);
  if (emojiOnly) {
    return null;
  }

  // filter out stop words
  messageString = withoutStopWords(messageString);
  // filter out swear words
  messageString = withoutSwearWords(messageString);

  // don't index short messages - will eliminate things like
  // +1, nice, lol, cool, etc from being stored
  if (messageString && getWordCount(messageString) < 10) {
    return null;
  }

  // algolia only supports 20kb records
  // slice it down until its under 19k, leaving room for the rest of the data
  while (byteCount(messageString) >= 19000) {
    messageString = messageString.slice(0, -100);
  }

  // passed all checks
  return messageString;
};

exports.up = function(r, conn) {
  return (
    r
      .table('messages')
      // dont index media messages or dm messages
      .filter(row =>
        row('messageType')
          .eq('text')
          .or(row('messageType').eq('draftjs'))
          .and(row('threadType').eq('story'))
      )
      .eqJoin('threadId', r.table('threads'))
      .without({
        left: ['threadType'],
        right: [
          'attachments',
          'edits',
          'watercooler',
          'content',
          'modifiedAt',
          'type',
          'id',
        ],
      })
      .zip()
      .run(conn)
      .then(cursor => cursor.toArray())
      .then(messages =>
        messages.map(message => {
          const messageString = filterMessageString(message);
          if (!messageString) return;

          const searchableMessage = {
            channelId: message.channelId,
            communityId: message.communityId,
            creatorId: message.senderId,
            lastActive: new Date(message.lastActive).getTime(),
            threadId: message.threadId,
            messageContent: {
              body: messageString,
            },
            threadContent: {
              title: '',
              body: '',
            },
            objectID: message.id,
            createdAt: new Date(message.timestamp).getTime(),
          };

          const messageAsString = JSON.stringify(searchableMessage);
          if (byteCount(messageAsString) >= 19000) {
            // we have a few code messages that can't get turned into plain
            // text, and are pretty huge - if we encounter one of those, we return
            // here
            console.log('escaping a message');
            return;
          }
          return searchableMessage;
        })
      )
      .then(searchableMessages => {
        return searchIndex.addObjects(searchableMessages.filter(Boolean));
      })
      .catch(err => console.log(err))
  );
};

exports.down = function(r, conn) {
  // Not spending any time undoing this
  return Promise.resolve();
};
