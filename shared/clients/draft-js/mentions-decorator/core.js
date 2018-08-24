// @flow
import React from 'react';
import { MENTIONS } from '../../../regexps';
import type { ComponentType, Node } from 'react';
import type { ContentBlock } from 'draft-js/lib/ContentBlock';

export type MentionComponentPropsType = {
  username: string,
  children: Node,
};

type MentionsPosition = {
  startPos: string,
  endPos: string,
};

// Get all the position of the mentions from start to finish. With that array we can call the callback function.
export const getMentionsPositionsFromMessage = (
  message: string
): Array<MentionsPosition> => {
  const mentionCoordinates = [];
  const newMessage = message;

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
    callback: (...args?: Array<any>) => any,
    contentState: any
  ) => {
    // This prevents the search for mentions when we're inside of a code-block
    if (contentBlock.type === 'code-block') return;
    if (!contentState) return;

    // -> "@brian_lovin, what's up with @mxstbr?"
    const text = contentBlock.getText();
    // -> ["@brian_lovin", " @mxstbr"];
    let matches = text.match(MENTIONS);

    if (!matches || matches.length === 0) return;

    matches = matches.filter(mention => !mention.startsWith('/'));

    if (!matches || matches.length === 0) return;

    const mentionCoordinates = getMentionsPositionsFromMessage(text);

    const selectionKeyOffset = contentState
      .getSelectionAfter()
      .getStartOffset();

    mentionCoordinates.forEach(({ startPos, endPos }) => {
      // if cursor is currently on a mention, don't match
      // this is so that the decorator doesn't conflict with the
      // decorator from draft-js-mention-plugin that renders the suggestions portal
      if (startPos < selectionKeyOffset && selectionKeyOffset < endPos) return;
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
