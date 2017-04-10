import React from 'react';
import styled from 'styled-components';
import { Gradient } from '../../../../shared/Globals';
import sanitizeHtml from 'sanitize-html';

type BubbleProps = {
  me: boolean,
  persisted: boolean,
  sender: Object,
  message: Object,
  imgSrc: ?string,
};

export const Bubble = (props: BubbleProps) => {
  const { me, persisted, sender, message } = props;
  return (
    <TextBubble
      me={me}
      persisted={persisted}
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(message.content),
      }}
    />
  );
};

export const EmojiBubble = (props: BubbleProps) => {
  const { me, persisted, sender, message } = props;
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

export const ImgBubble = props => {
  const { me, persisted, sender, imgSrc } = props;
  return (
    <ImageBubble
      onClick={props.openGallery}
      me={me}
      persisted={persisted}
      sender={sender}
      src={imgSrc}
    />
  );
};

const TextBubble = styled.p`
  padding: 8px 16px;
  vertical-align: middle;
  border-radius: 16px;
  font-size: 14px;
  line-height: 20px;
  opacity: ${props => props.persisted === false ? 0.5 : 1};
  transition: opacity 0.2s ease-out;
  background-color: ${props =>
  props.me ? props.theme.brand.default : props.theme.generic.default};
  background-image: ${props =>
  props.me
    ? Gradient(props.theme.brand.alt, props.theme.brand.default)
    : Gradient(props.theme.generic.alt, props.theme.generic.default)}
  color: ${props =>
  props.me ? props.theme.text.reverse : props.theme.text.default};
  align-self: ${props => props.me ? `flex-end;` : `flex-start;`}
  font-weight: ${props => props.me ? `500` : `400`};
  clear: both;

  & + & {
    margin-top: 2px;
  }

  &::selection {
    background-color: ${props =>
  props.me ? props.theme.text.default : props.theme.brand.alt};
  }
`;

const Emoji = styled.div`
  font-size: 40px;
  padding: 8px 0;
  clear: both;
  display: block;
  margin-top: 12px;
  margin-bottom: 12px;
  display: flex;
  align-self: ${props => props.me ? `flex-end;` : `flex-start;`};
  opacity: ${props => props.persisted === false ? 0.5 : 1};

  &:last-of-type {
    margin-bottom: 0;
  }

  &:first-of-type:not(:last-of-type) { /* if two emojis are posted back to back, don't add margin to the first one */
    margin-bottom: 0;
  }

  & + & {
    margin: 0; /* if two emojis are next to each other, no margin needed */
  }

  & + img {
    margin-top: 8px; /* if emoj is followed by an image */
    margin-bottom: 8px;
  }

  & + p {
    margin-top: 8px; /* if emoji is followed by a bubble, add margin to the bubble */
  }
`;

const ImageBubble = styled.img`
  display: block;
  clear: both;
  flex: 0 0 auto;
  vertical-align: middle;
  border-radius: 16px
  margin-top: 2px;
  max-width: 100%;
  display: flex;
  align-self: ${props => props.me ? `flex-end;` : `flex-start;`};
  opacity: ${props => props.persisted === false ? 0.5 : 1};
  border: 1px solid #f6f7f8;
`;
