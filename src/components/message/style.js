// @flow
import theme from 'shared/theme';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { SvgWrapper } from 'src/components/icon';
import { Truncate, monoStack, hexa } from 'src/components/globals';
import { Wrapper as EditorWrapper } from '../rich-text-editor/style';
import { MEDIA_BREAK } from 'src/components/layout';

export const Byline = styled.span`
  display: flex;
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  margin-bottom: 4px;
  user-select: none;
  color: ${theme.text.default};
  max-width: 100%;
  position: relative;
  flex-wrap: wrap;
  align-items: center;

  a {
    display: flex;
    flex-wrap: wrap;
  }
`;

export const Name = styled.span`
  font-weight: 600;
  font-size: 15px;
  color: ${theme.text.default};
  margin-right: 2px;
  display: flex;

  &:hover {
    color: ${theme.text.default};
    cursor: pointer;
  }

  @media (max-width: 400px) {
    line-height: 1.4;
  }
`;

export const Username = styled(Name)`
  font-weight: 400;
  margin-left: 2px;
  margin-right: 2px;
  color: ${theme.text.alt};
  display: flex;

  @media (max-width: 400px) {
    line-height: 1.4;
  }
`;

export const ActionsContainer = styled.span`
  position: absolute;
  top: -16px;
  right: -16px;
  height: 28px;
  width: 50%;
  pointer-events: none;
  opacity: 0;
`;

export const Actions = styled.ul`
  position: absolute;
  top: 0;
  right: 16px;
  border-radius: 4px;
  border: 1px solid ${theme.bg.border};
  background: ${theme.bg.default};
  list-style-type: none;
  display: flex;
  margin-left: 30px;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
`;

export const Action = styled.li`
  border-left: 1px solid ${theme.bg.border};
  padding: 3px 10px;
  display: flex;
  flex: 0 1 auto;
  color: ${theme.text.secondary};

  &:hover {
    cursor: pointer;
    color: ${theme.text.default};
  }

  &:first-child {
    border-left: 0;
  }
`;

export const LikeAction = styled(Action)`
  color: ${props =>
    props.hasReacted ? props.theme.warn.alt : props.theme.text.secondary};

  &:hover {
    color: ${props =>
      props.hasReacted ? props.theme.warn.alt : props.theme.text.default};
  }
`;

export const GutterTimestamp = styled(Link)`
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  width: 72px;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.text.secondary};
  opacity: 0;
  ${Truncate};

  @media (max-width: 400px) {
    display: none !important;
  }
`;

export const OuterMessageContainer = styled.div`
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  padding-right: 16px;
  align-self: stretch;
  position: relative;
  padding-right: 16px;
  background: ${props =>
    props.selected
      ? props.theme.special.wash
      : props.error
      ? props.theme.warn.wash
      : 'transparent'};

  ${props =>
    props.selected &&
    css`
      background: ${props.theme.special.wash};

      ${ActionsContainer} {
        opacity: 1;
        pointer-events: auto;
      }

      ${GutterTimestamp} {
        opacity: 1;
      }
    `}

  &:hover,
  &:focus,
  &:active {
    background: ${props =>
      props.selected
        ? props.theme.special.wash
        : props.error
        ? props.theme.warn.border
        : props.theme.bg.wash};

    ${ActionsContainer} {
      opacity: 1;
      pointer-events: auto;
    }

    ${GutterTimestamp} {
      opacity: 1;
    }
  }
`;

export const InnerMessageContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  padding-right: 32px;
  flex-direction: column;
  padding: 4px 0;
  position: relative;
`;

export const GutterContainer = styled.div`
  display: flex;
  width: 72px;
  min-width: 72px;
  max-width: 72px;
`;

export const AuthorAvatarContainer = styled.div`
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 4px;
`;

const Bubble = styled.div`
  display: inline-block;
  border-radius: 16px;
  vertical-align: middle;
  white-space: pre-line;
  word-wrap: break-word;
  word-break: break-word;
  align-self: flex-start;
  clear: both;

  &::selection {
    background-color: ${theme.brand.alt};
  }

  code {
    border-radius: 4px;
    padding: 2px 4px;
    background: ${theme.bg.wash};
    border: 1px solid ${theme.bg.border};
    color: ${theme.text.secondary};
  }

  pre {
    font-size: 14px;
    margin: 8px 0;
    width: 100%;
    border-radius: 8px;
    padding: 8px 16px;
    background: ${theme.bg.wash};
    border: 1px solid ${theme.bg.border};
    color: ${theme.text.secondary};
  }

  pre code {
    padding: 0;
    background: none;
    border: none;
    color: inherit;
  }
`;

export const Text = styled(Bubble)`
  font-size: 16px;
  line-height: 1.4;
  color: ${props =>
    props.error ? props.theme.warn.default : props.theme.text.default};
  font-weight: 400;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  width: 100%;

  a {
    text-decoration: underline;
    word-break: break-word;
  }

  ul,
  ol {
    margin-top: 0;
    margin-bottom: 0;
  }
`;

export const Emoji = styled(Bubble)`
  font-size: 48px;
  line-height: 1;
  vertical-align: middle;
  clear: both;
  display: block;
  margin-top: 12px;
  display: flex;
  align-self: flex-start;

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
    margin-top: 8px; /* if emoji is followed by an image */
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
  align-self: flex-start;
  opacity: 1;
  transition: opacity 0.2s ease-out;
  border: 1px solid #f6f7f8;
  margin-top: 0;
  margin-bottom: 0;
  cursor: pointer;
`;

export const Code = styled(Bubble)`
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${theme.bg.reverse};
  border: 1px solid ${theme.bg.border};
  color: ${theme.text.reverse};
  max-width: 100%;
  overflow-x: scroll;
  list-style: none;
`;

export const Line = styled.pre`
  display: inline-block;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
  word-wrap: break-word;
  ${monoStack};
  border: 1px solid ${theme.bg.border};
`;

export const Paragraph = styled.div`
  white-space: pre-wrap;
  word-break: break-word;

  &:not(:empty) ~ &:not(:empty) {
    margin-top: 8px;
  }
`;

export const BlockQuote = styled.blockquote`
  line-height: 1.5;
  border-left: 4px solid ${theme.bg.border};
  color: ${theme.text.alt};
  padding: 4px 12px 4px 16px;
`;

export const QuotedParagraph = styled.div`
  color: ${theme.text.alt};

  code {
    color: ${theme.text.alt};
  }
  /* overrides Bubble component styles to fix #3098 */
  pre {
    margin: 0;
    margin-top: 8px;
    width: 100%;
    border: 1px solid ${props => hexa(props.theme.brand.border, 0.5)};
    color: ${theme.text.alt};
  }
`;

export const QuoteWrapperGradient = styled.div`
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 1),
    rgba(255, 255, 255, 0)
  );
  height: 2em;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const QuoteWrapper = styled.div`
  border-left: 4px solid ${theme.bg.border};
  color: ${theme.text.alt};
  padding: 4px 12px 4px 16px;
  max-height: ${props => (props.expanded ? 'none' : '7em')};
  margin-top: 4px;
  margin-bottom: 8px;
  overflow-y: hidden;
  cursor: pointer;
  position: relative;

  ${SvgWrapper} {
    margin-left: -3px;
    margin-right: 2px;
  }

  /* Don't change the color of the name and username on hover since they aren't clickable in quotes */
  ${Username}:hover, ${Byline}:hover {
    color: ${theme.text.secondary};
  }

  ${Name} {
    font-size: 14px;
    font-weight: 600;
    color: ${theme.text.secondary};
  }

  ${Name}:hover {
    color: ${theme.text.default};
  }

  ${Username} {
    font-size: 13px;
    font-weight: 500;
    color: ${theme.text.alt};
  }
`;

export const BadgesContainer = styled.div`
  display: flex;
  margin-left: 4px;

  @media (max-width: 400px) {
    margin-top: 4px;
  }
`;

export const EditorInput = styled(EditorWrapper)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex: auto;
  font-size: 15px;
  font-weight: 500;
  line-height: 20px;
  min-height: 40px;
  padding: 8px 16px;
  transition: padding 0.2s ease-in-out;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.bg.border};
  transition: border 0.3s ease-out;
  color: ${props => props.theme.text.secondary};
  background: ${props => props.theme.bg.default};
  max-width: 100%;
  word-break: break-all;

  @media (max-width: ${MEDIA_BREAK}px) {
    font-size: 16px;
    padding-left: 16px;
  }

  &::placeholder {
    color: ${props => props.theme.text.placeholder};
  }
  &::-webkit-input-placeholder {
    color: ${props => props.theme.text.placeholder};
  }
  &:-moz-placeholder {
    color: ${props => props.theme.text.placeholder};
  }
  &:-ms-input-placeholder {
    color: ${props => props.theme.text.placeholder};
  }

  &:hover {
    border-color: ${props => props.theme.text.alt};
    transition: border-color 0.2s ease-in;
  }

  pre {
    ${monoStack};
    font-size: 15px;
    font-weight: 500;
    background-color: ${theme.bg.wash};
    border: 1px solid ${theme.bg.border};
    border-radius: 2px;
    padding: 4px;
    margin-right: 16px;
  }

  blockquote {
    line-height: 1.5;
    border-left: 4px solid ${theme.bg.border};
    color: ${theme.text.alt};
    padding: 4px 12px 4px 16px;
  }
`;

export const EditActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 8px;
`;

export const EditedIndicator = styled.span`
  display: block;
  font-size: 11px;
  color: ${props => props.theme.text.alt};
`;

export const ThreadAttachmentsContainer = styled.ul``;
