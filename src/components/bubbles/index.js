//@flow
import React from 'react';
//$FlowFixMe
import sanitizeHtml from 'sanitize-html';
//$FlowFixMe
import * as Autolinker from 'autolinker';
import { TextBubble, Emoji, ImageBubble } from './style';

type BubbleProps = {
  me: boolean,
  persisted: boolean,
  sender: Object,
  message: Object,
  imgSrc: ?string,
  type: ?'thread' | 'messageGroup',
};

export const Bubble = (props: BubbleProps) => {
  const { me, persisted, message, type } = props;

  const formatMessageForChannelLinks = (message: string): string => {
    if (!message) {
      return '';
    }
    const cleanMessage = sanitizeHtml(message);

    return cleanMessage;
    // const linkedMessage = Autolinker.link(
    //   cleanMessage.replace(
    //     CHANNELS,
    //     `$1https://spectrum.chat/${activeCommunity}/$2`
    //   )
    // );
    // // Remove the "spectrum.chat" part from the link text so in the message
    // // you just see "~channel", but it's linked to the channel
    // return linkedMessage.replace(CHANNEL_ANCHORS, '>$1</a>');
  };

  const formatMessageForLinks = (message: string): string => {
    if (!message) {
      return '';
    }
    const cleanMessage = sanitizeHtml(message);

    const linkedMessage = Autolinker.link(cleanMessage);

    return linkedMessage;
  };

  return (
    <TextBubble
      me={me}
      persisted={persisted}
      dangerouslySetInnerHTML={{
        // if in a thread, we convert `~channel` into a link.
        // if in a groupMessage, don't regex links
        __html: type === 'thread'
          ? formatMessageForChannelLinks(message.content)
          : formatMessageForLinks(message.content),
      }}
    />
  );
};

export const EmojiBubble = (props: BubbleProps) => {
  const { me, persisted, message } = props;
  return (
    <Emoji
      me={me}
      persisted={persisted}
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(message.content),
      }}
    />
  );
};

export const ImgBubble = (props: Object) => {
  const { me, persisted, imgSrc } = props;
  return (
    <ImageBubble
      onClick={props.openGallery}
      me={me}
      persisted={persisted}
      src={imgSrc}
    />
  );
};
