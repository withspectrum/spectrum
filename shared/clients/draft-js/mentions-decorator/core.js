// @flow
import type { ContentBlock } from 'draft-js/lib/ContentBlock';
import { MENTIONS } from '../../../regexps';
import type { ComponentType } from 'react';

const createMentionsDecorator = (component: ComponentType<Object>) => ({
  strategy: (
    contentBlock: ContentBlock,
    callback: (...args?: Array<any>) => any
  ) => {
    // -> "@brian_lovin, what's up with @mxstbr?"
    const text = contentBlock.getText();
    // -> ["@brian_lovin", " @mxstbr"];
    const matches = text.match(MENTIONS);
    if (!matches || matches.length === 0) return;

    matches.forEach(match => {
      // Because JS Regexps don't have lookbehinds we have to include the whitespace before the mention in the regex match
      // The .trim here makes sure we don't highlight that whitespace as a mention
      // -> " @mxstbr" -> "@mxstbr"
      const mention = match.trim();
      const start = text.indexOf(mention);
      callback(start, start + mention.length);
    });
  },
  component,
});

export default createMentionsDecorator;
