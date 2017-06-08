//@flow
import React from 'react';
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

  const formatMessageForLinks = (body: string): string => {
    if (!body) {
      return '';
    } else {
      const linkedMessage = Autolinker.link(body);
      return linkedMessage;
    }
  };

  return (
    <TextBubble me={me} pending={pending}>
      {message.body}
    </TextBubble>
  );
};

export const EmojiBubble = (props: BubbleProps) => {
  const { me, pending, message } = props;
  return (
    <Emoji me={me} pending={pending}>
      {message.body}
    </Emoji>
  );
};

export const ImgBubble = (props: Object) => {
  const { me, pending, imgSrc } = props;
  return (
    <ImageBubble
      onClick={props.openGallery}
      me={me}
      pending={pending}
      src={`${imgSrc}${pending ? '' : `?max-w=${window.innerWidth * 0.6}`}`}
    />
  );
};
