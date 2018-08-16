// @flow
import createEmojiRegex from 'emoji-regex';
import type { RawDraftContentState } from 'draft-js/lib/RawDraftContentState';

// This regex matches every string with any emoji in it, not just strings that only have emojis
const originalEmojiRegex = createEmojiRegex();

// Make sure we match strings that _only_ contain emojis (and whitespace)
const regex = new RegExp(
  '^(' + originalEmojiRegex.toString().replace(/\/g$/, '') + '|\\s)+$'
);

const onlyContainsEmoji = (text: string) => regex.test(text);

// DraftJS-specific check
export const draftOnlyContainsEmoji = (raw: RawDraftContentState) =>
  raw.blocks.length === 1 &&
  raw.blocks[0].type === 'unstyled' &&
  onlyContainsEmoji(raw.blocks[0].text);

export default onlyContainsEmoji;
