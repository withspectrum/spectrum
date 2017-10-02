// @flow
// $FlowFixMe
import styled from 'styled-components';
import { Gradient } from '../globals';

export const Wrapper = styled.div``;

export const ActionUI = styled.div``;

export const Indicator = styled.div``;

export const Action = styled.div``;

export const ModeratorActions = styled.div``;

export const Time = styled.div``;

export const Text = styled.p`
  padding: 8px 16px;
  vertical-align: middle;
  border-radius: 16px;
  font-size: 14px;
  line-height: 20px;
  transition: opacity 0.2s ease-out;
  background-color: ${props =>
    props.me ? props.theme.brand.default : props.theme.generic.default};
  background-image: ${props =>
    props.me
      ? Gradient(props.theme.brand.alt, props.theme.brand.default)
      : Gradient(props.theme.generic.alt, props.theme.generic.default)};
  color: ${props =>
    props.me ? props.theme.text.reverse : props.theme.text.default};
  align-self: ${props => (props.me ? `flex-end;` : `flex-start;`)};
  font-weight: ${props => (props.me ? `500` : `400`)};
  clear: both;
  white-space: pre-line;
  word-wrap: break-word;
  word-break: break-word;
  box-shadow: ${props =>
    props.hashed
      ? `0 0 0 2px ${props.theme.bg.default}, 0 0 0 4px ${props.theme.brand
          .default}`
      : ''};
  margin-top: ${props => (props.hashed ? '4px' : '0')};
  margin-bottom: ${props => (props.hashed ? '4px' : '0')};

  & + & {
    margin-top: 2px;
  }

  a {
    text-decoration: underline;
    word-break: break-word;
  }

  &::selection {
    background-color: ${props =>
      props.me ? props.theme.text.default : props.theme.brand.alt};
  }
`;

export const Emoji = styled.div`
  font-size: 40px;
  padding: 4px 0 8px;
  clear: both;
  display: block;
  margin-top: 8px;
  margin-bottom: 12px;
  display: flex;
  align-self: ${props => (props.me ? `flex-end;` : `flex-start;`)};

  &:last-of-type {
    margin-bottom: 0;
  }

  &:first-of-type:not(:last-of-type) {
    /* if two emojis are posted back to back, don't add margin to the first one */
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

export const Image = styled.img`
  display: block;
  clear: both;
  flex: 0 0 auto;
  vertical-align: middle;
  border-radius: 16px;
  max-width: 100%;
  display: flex;
  align-self: ${props => (props.me ? `flex-end;` : `flex-start;`)};
  opacity: ${props => (props.pending ? 0.5 : 1)};
  transition: opacity 0.2s ease-out;
  border: 1px solid #f6f7f8;
  margin-top: ${props => (props.hashed ? '4px' : '0')};
  margin-bottom: ${props => (props.hashed ? '4px' : '0')};
  box-shadow: ${props =>
    props.hashed
      ? `0 0 0 2px ${props.theme.bg.default}, 0 0 0 4px ${props.theme.brand
          .default}`
      : ''};
`;
