//@flow
import React from 'react';
//$FlowFixMe
import sanitizeHtml from 'sanitize-html';
//$FlowFixMe
import * as Autolinker from 'autolinker';
import { TextBubble, Emoji, ImageBubble } from './style';

type BubbleProps = {
  me: boolean,
  pending: boolean,
  sender: Object,
  message: Object,
  imgSrc?: String,
  type: ?'thread' | 'messageGroup',
};

export const Bubble = (props: BubbleProps) => {
  const { me, pending, message, type } = props;

  const formatMessageForChannelLinks = (body: string): string => {
    if (!body) {
      return '';
    } else {
      const cleanMessage = sanitizeHtml(body);

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
    }
  };

  const formatMessageForLinks = (body: string): string => {
    if (!body) {
      return '';
    } else {
      const cleanMessage = sanitizeHtml(body);

      const linkedMessage = Autolinker.link(cleanMessage);

      return linkedMessage;
    }
  };

  return (
    <TextBubble
      me={me}
      pending={pending}
      dangerouslySetInnerHTML={{
        // if in a thread, we convert `~channel` into a link.
        // if in a groupMessage, don't regex links
        __html: type === 'thread'
          ? formatMessageForChannelLinks(message.body)
          : formatMessageForLinks(message.body),
      }}
    />
  );
};

export const EmojiBubble = (props: BubbleProps) => {
  const { me, pending, message } = props;
  return (
    <Emoji
      me={me}
      pending={pending}
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(message.body),
      }}
    />
  );
};

export const ImgBubble = (props: Object) => {
  const { me, pending, imgSrc } = props;
  return (
    <ImageBubble
      onClick={props.openGallery}
      me={me}
      pending={pending}
      src={`${imgSrc}?max-w=${window.innerWidth * 0.6}`}
    />
  );
};
