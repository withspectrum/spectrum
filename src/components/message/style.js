// @flow
import styled from 'styled-components';
import { SvgWrapper } from '../icons';
import { zIndex, Transition, monoStack, hexa, Tooltip } from '../globals';
import { Byline, Name, Username } from '../messageGroup/style';

export const ActionsContainer = styled.span`
  position: absolute;
  top: -16px;
  right: -16px;
  height: 32px;
  width: 50%;
  pointer-events: none;
  opacity: 0;
  z-index: ${zIndex.chatInput};
`;

export const Actions = styled.ul`
  position: absolute;
  top: 0;
  right: 16px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.bg.border};
  background: ${props => props.theme.bg.default};
  list-style-type: none;
  display: flex;
  margin-left: 30px;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
`;

export const Action = styled.li`
  border-left: 1px solid ${props => props.theme.bg.border};
  padding: 6px 12px;
  display: flex;
  flex: 0 1 auto;
  color: ${props => props.theme.text.secondary};

  &:hover {
    cursor: pointer;
    color: ${props => props.theme.text.default};
  }

  &:first-child {
    border-left: 0;
  }

  ${Tooltip};
`;

export const LikeAction = styled(Action)`
  color: ${props =>
    props.hasReacted ? props.theme.warn.alt : props.theme.text.secondary};

  &:hover {
    color: ${props =>
      props.hasReacted ? props.theme.warn.alt : props.theme.text.default};
  }
`;

export const OuterMessageContainer = styled.div`
  display: flex;
  flex: 1 0 auto;
  align-self: stretch;
  position: relative;
  padding-right: 16px;
  background: ${props =>
    props.selected
      ? props.theme.special.wash
      : props.error ? props.theme.warn.wash : props.theme.bg.default};

  &:hover {
    background: ${props =>
      props.selected
        ? props.theme.special.border
        : props.error ? props.theme.warn.border : props.theme.bg.wash};

    ${ActionsContainer} {
      opacity: 1;
      pointer-events: auto;
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
  z-index: ${zIndex.card};
  vertical-align: middle;
  white-space: pre-line;
  word-wrap: break-word;
  word-break: break-word;
  align-self: flex-start;
  clear: both;

  &::selection {
    background-color: ${props => props.theme.brand.alt};
  }

  code {
    border-radius: 4px;
    padding: 2px 4px;
    background: ${props => props.theme.bg.wash};
    border: 1px solid ${props => props.theme.bg.border};
    color: ${props => props.theme.text.secondary};
  }

  pre {
    font-size: 14px;
    margin: 8px 0;
    width: 100%;
    border-radius: 8px;
    padding: 8px 16px;
    background: ${props => props.theme.bg.wash};
    border: 1px solid ${props => props.theme.bg.border};
    color: ${props => props.theme.text.secondary};
  }
`;

export const ActionWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: flex-start;
  background-color: transparent;
  height: 24px;
  padding: 0 4px;
  margin-left: 4px;
  cursor: pointer;

  color: ${props => props.theme.text.placeholder};

  span {
    padding-left: 4px;
    font-size: 14px;
  }
`;

export const ModActionWrapper = styled(ActionWrapper)`
  padding: 0 8px;
  border-left: 2px solid ${props => props.theme.bg.wash};
`;

export const ActionUI = styled.div`
  display: flex;
  align-items: stretch;
  transition: ${Transition.hover.off};

  &:hover {
    transition: ${Transition.hover.on};

    ${ActionWrapper} {
      visibility: visible;
      opacity: 1;
      transition: ${Transition.hover.on};
    }
  }

  ${ActionWrapper} {
    transition: ${Transition.hover.off};
    visibility: hidden;
    opacity: 0;
  }
`;

export const Time = styled.div`
  font-size: 11px;
  color: ${props => props.theme.text.alt};
  position: absolute;
  left: calc(100% + 8px);
  top: 4px;
`;

export const Text = styled(Bubble)`
  font-size: 15px;
  line-height: 1.4;
  color: ${props =>
    props.error ? props.theme.warn.default : props.theme.text.secondary};
  font-weight: 400;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  width: 100%;

  a {
    text-decoration: underline;
    word-break: break-word;
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
  background-color: ${props => props.theme.bg.reverse};
  border: 1px solid ${props => props.theme.bg.border};
  color: ${props => props.theme.text.reverse};
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
  border: 1px solid ${props => props.theme.bg.border};
`;

export const Paragraph = styled.p`
  line-height: 1.5;

  &:not(:empty) ~ &:not(:empty) {
    margin-top: 1em;
  }
`;

export const QuotedParagraph = Paragraph.withComponent('div').extend`
  color: ${props => props.theme.text.alt};

  code {
    color: ${props => props.theme.text.alt};
  }
  /* overrides Bubble component styles to fix #3098 */
  pre {
    margin: 0;
    width: 100%;
    border: 1px solid ${props => hexa(props.theme.brand.border, 0.5)};
    color: ${props => props.theme.text.alt};
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
  border-left: 4px solid ${props => props.theme.bg.border};
  color: ${props => props.theme.text.alt};
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
    color: ${props => props.theme.text.secondary};
  }

  ${Name} {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.text.secondary};
  }

  ${Name}:hover {
    color: ${props => props.theme.text.default};
  }

  ${Username} {
    font-size: 13px;
    font-weight: 500;
    color: ${props => props.theme.text.alt};
  }
`;
