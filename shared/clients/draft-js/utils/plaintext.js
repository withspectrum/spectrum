// @flow
import type { RawContentState } from 'draft-js';

export const toPlainText = (raw: RawContentState) => {
  return raw.blocks
    .filter(block => block.type === 'unstyled')
    .map(block => block.text)
    .join('\n');
};
