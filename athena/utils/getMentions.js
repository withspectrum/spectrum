// @flow
import { MENTIONS } from 'shared/regexps';

export const getMentions = (text: string): Array<string> => {
  const mentions = text.match(MENTIONS) || [];
  if (!mentions || mentions.length === 0) return [];
  const cleaned = removeAtSymbol(mentions);
  const distinct = getDistinctMentions(cleaned);
  return distinct;
};

const removeAtSymbol = (usernames: Array<string>): Array<string> => {
  return usernames.map(u => u.substr(1));
};

export const getDistinctMentions = (
  usernames: Array<string>
): Array<string> => {
  return usernames.filter((v, i, a) => a.indexOf(v) === i);
};
