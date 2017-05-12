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
  type: ?'story' | 'messageGroup',
};

export const Bubble = (props: BubbleProps) => {
  const { me, persisted, message, type } = props;

  const formatMessageForFrequencyLinks = (message: string): string => {
    if (!message) {
      return '';
    }
    const cleanMessage = sanitizeHtml(message);

    return cleanMessage;
    // const linkedMessage = Autolinker.link(
    //   cleanMessage.replace(
    //     FREQUENCIES,
    //     `$1https://spectrum.chat/${activeCommunity}/$2`
    //   )
    // );
    // // Remove the "spectrum.chat" part from the link text so in the message
    // // you just see "~frequency", but it's linked to the frequency
    // return linkedMessage.replace(FREQUENCY_ANCHORS, '>$1</a>');
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
        // if in a story, we convert `~frequency` into a link.
        // if in a groupMessage, don't regex links
        __html: type === 'story'
          ? formatMessageForFrequencyLinks(message.content)
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
