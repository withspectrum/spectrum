// @flow
import React from 'react';
import { MENTIONS } from '../../../regexps';
import type { ComponentType, Node } from 'react';
import type { ContentBlock } from 'draft-js/lib/ContentBlock';

export type MentionComponentPropsType = {
  username: string,
  children: Node,
};

// 1. Get all the position of the mentions from start to finish
//  "Hello @ale @ange @ale @ange" should return => [[6, 9], [11, 15], [17, 20], [22, 26]]
// 2. With that array we can call the callback function.
export const getMentionsPositionsFromMessage = (
  message: string
): Array<{ startPos: number, endPos: number }> => {
  const mentionCoordinates = [];
  const newMessage = message;

  // $FlowFix
  newMessage.replace(MENTIONS, (match, position) => {
    mentionCoordinates.push({
      startPos: position,
      endPos: position + match.length,
    });

    return match;
  });

  return mentionCoordinates;
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

    const mentionCoordinates = getMentionsPositionsFromMessage(text);

    mentionCoordinates.forEach(({ startPos, endPos }) => {
      callback(startPos, endPos);
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
