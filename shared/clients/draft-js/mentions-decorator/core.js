// @flow
import React from 'react';
import { MENTIONS } from '../../../regexps';
import type { ComponentType, Node } from 'react';
import type { ContentBlock } from 'draft-js/lib/ContentBlock';

export type MentionComponentPropsType = {
  username: string,
  children: Node,
};

let i = 0;
const createMentionsDecorator = (
  Component: ComponentType<MentionComponentPropsType>
) => ({
  strategy: (
    contentBlock: ContentBlock,
    callback: (...args?: Array<any>) => any
  ) => {
    // This prevents the search for mentions when we're inside of a code-block
    if (contentBlock.type === 'code-block') return;

    // -> "@brian_lovin, what's up with @mxstbr?"
    const text = contentBlock.getText();
    // -> ["@brian_lovin", " @mxstbr"];
    let matches = text.match(MENTIONS);

    if (!matches || matches.length === 0) return;

    matches = matches.filter(mention => !mention.startsWith('/'));

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
  component: (props: { decoratedText: string, children: Node }) => (
    <Component
      username={props.decoratedText.substr(1)}
      children={props.children}
      /* NOTE(@mxstbr): This is super hacky, but I couldn't find a way to give two mentions in the same message a different key. (i.e. "Yo @mxstbr, where is @brianlovin at? I can't find @brianlovin" would only show the mention once) */
      key={`mention-${i++}`}
    />
  ),
});

export default createMentionsDecorator;
