// @flow
import truncate from 'shared/truncate';
import type { RawContentState } from 'draft-js';

const nthIndexOf = (string, pattern, n) => {
  var i = -1;

  while (n-- && i++ < string.length) {
    i = string.indexOf(pattern, i);
    if (i < 0) break;
  }

  return i;
};

export default (state: RawContentState): string => {
  const textBlocks = state.blocks.filter(
    ({ type }) =>
      type === 'unstyled' ||
      type.indexOf('header') === 0 ||
      type.indexOf('list') > -1
  );
  const text = textBlocks
    .map((block, index) => {
      switch (block.type) {
        case 'unordered-list-item':
          return `• ${block.text}`;
        case 'ordered-list-item': {
          const number = textBlocks.reduce((number, b, i) => {
            if (i >= index) return number;
            if (b.type !== 'ordered-list-item') return number;
            return number + 1;
          }, 1);
          return `${number}. ${block.text}`;
        }
        default:
          return block.text;
      }
    })
    .join('\n')
    // Replace multiple line breaks with a single one
    .replace(/[\r\n]+/g, '\n');
  const indexOfThirdLineBreak = nthIndexOf(text, '\n', 3);
  const cut = text.substr(
    0,
    indexOfThirdLineBreak > -1 ? indexOfThirdLineBreak : text.length
  );
  return truncate(cut !== text ? `${cut} …` : cut, 280);
};
