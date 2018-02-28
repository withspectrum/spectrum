// @flow
const stopword = require('stopword');

import createEmojiRegex from 'emoji-regex';

// This regex matches every string with any emoji in it, not just strings that only have emojis
const originalEmojiRegex = createEmojiRegex();
// Make sure we match strings that only contain emojis (and whitespace)
const regex = new RegExp(
  `^(${originalEmojiRegex.toString().replace(/\/g$/, '')}|\\s)+$`
);
export const onlyContainsEmoji = (text: string) => regex.test(text);

export const strToArray = (str: string): Array<string> => {
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

export const getWordCount = (str: string): number => {
  const arr = strToArray(str);
  return arr.length;
};

export const withoutStopWords = (str: string): string => {
  // turn the string into an array of words
  const arr = strToArray(str);
  // filter out any words that are considered stop words
  const cleaned = stopword.removeStopwords(arr);
  // join the array back into a string
  const joined = cleaned.join(' ');
  // return the string
  return joined;
};
