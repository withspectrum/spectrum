import React from 'react';
import replace from 'string-replace-to-array';
import { TextBubble, Emoji, ImageBubble } from './style';

const MARKDOWN_LINK = /(?:\[(.*?)\]\((.*?)\))/g;

const renderMarkdownLinks = text => {
  return replace(text, MARKDOWN_LINK, (fullLink, text, url) =>
    <a href={url} target="_blank" rel="noopener nofollower">
      {text}
    </a>
  );
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
      {renderMarkdownLinks(message.body)}
    </TextBubble>
  );
};

export const EmojiBubble = (props: BubbleProps) => {
  const { me, message } = props;
  return (
    <Emoji me={me}>
      {message.body}
    </Emoji>
  );
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
