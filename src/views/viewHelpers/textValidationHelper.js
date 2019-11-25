// @flow
/**
 * Collection of unicode code points that represent whitespaces and some other non visual characters.
 */
export const whiteSpaceRegex = /[\u007F\u0080-\u00A0\u0378\u0379\u0380-\u0383\u038B\u038D\u03A2\u0557\u0558\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\u180E\u200B-\u200D\u2060\uFEFF]/g;

/**
 * Collection of unicode code points that represent hyphens, different from the traditional ocidental hyphen (\u002D).
 */
export const oddHyphenRegex = /[\u00AD\u058A\u1806\u2010-\u2015\u2E3A\u2E3B\uFE58\uFE63\uFF0D]/g;
