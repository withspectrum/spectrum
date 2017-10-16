import React from 'react';
import replace from 'string-replace-to-array';
import { TextBubble, Emoji, ImageBubble } from './style';

const URL = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-]*)?\??(?:[\-\+=&;%@\.\w]*)#?(?:[\.\!\/\\\w]*))?)/g;

export const renderLinks = text => {
  return replace(text, URL, (fullLink, text, url) => (
    <a href={url} target="_blank" rel="noopener nofollower">
      {text}
    </a>
  ));
};

type BubbleProps = {
  me: boolean,
  pending: boolean,
  sender: Object,
  message: Object,
  imgSrc?: String,
};

export const Bubble = (props: BubbleProps) => {
  const { me, message, hashed } = props;

  return (
    <TextBubble hashed={hashed} me={me}>
      {renderLinks(message.body)}
    </TextBubble>
  );
};

export const EmojiBubble = (props: BubbleProps) => {
  const { me } = props;
  return <Emoji me={me}>{props.children || props.message.body}</Emoji>;
};

export const ImgBubble = (props: Object) => {
  const { me, pending, imgSrc, hashed } = props;
  return (
    <ImageBubble
      onClick={props.openGallery}
      me={me}
      pending={pending}
      src={`${imgSrc}${pending ? '' : `?max-w=${window.innerWidth * 0.6}`}`}
      hashed={hashed}
    />
  );
};
