// @flow
import React from 'react';
import redraft from 'redraft';
import { Text, Emoji, Image, QuotedParagraph } from './style';
import { messageRenderer } from 'shared/clients/draft-js/message/renderer';
import { draftOnlyContainsEmoji } from 'shared/only-contains-emoji';
import type { MessageInfoType } from 'shared/graphql/fragments/message/messageInfo.js';
import { messageTypeObj } from 'shared/draft-utils/message-types';

type BodyProps = {
  openGallery: Function,
  me: boolean,
  message: MessageInfoType,
  bubble?: boolean,
  showParent?: boolean,
};

// This regexp matches /community/channel/slug~id, /?thread=id, /?t=id etc.
// see https://regex101.com/r/aGamna/2/
export const Body = (props: BodyProps) => {
  const { message, openGallery, me, bubble = true } = props;
  const emojiOnly =
    message.messageType === messageTypeObj.draftjs &&
    draftOnlyContainsEmoji(JSON.parse(message.content.body));
  const WrapperComponent = bubble ? Text : QuotedParagraph;
  switch (message.messageType) {
    case 'optimistic':
      return (
        <div key={message.id} className="markdown">
          <WrapperComponent me={me}>
            <div dangerouslySetInnerHTML={{ __html: message.content.body }} />
          </WrapperComponent>
        </div>
      );
    case messageTypeObj.text:
    default:
      return (
        <WrapperComponent key={message.id} me={me}>
          {message.content.body}
        </WrapperComponent>
      );
    case messageTypeObj.media: {
      if (typeof message.id === 'number' && message.id < 0) {
        return null;
      }
      return (
        <Image
          key={message.id}
          onClick={openGallery}
          src={message.content.body}
        />
      );
    }
    case messageTypeObj.draftjs: {
      const parsed = JSON.parse(message.content.body);
      return (
        <WrapperComponent key={message.id} me={me}>
          {emojiOnly ? (
            <Emoji>
              {parsed && Array.isArray(parsed.blocks) && parsed.blocks[0].text}
            </Emoji>
          ) : (
            <div key={message.id} className="markdown">
              {redraft(parsed, messageRenderer)}
            </div>
          )}
        </WrapperComponent>
      );
    }
  }
};
