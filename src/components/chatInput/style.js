// @flow
import styled, { css } from 'styled-components';
import { IconButton } from '../buttons';
import { QuoteWrapper } from '../message/style';
import {
  FlexRow,
  hexa,
  Transition,
  zIndex,
  monoStack,
} from 'src/components/globals';
import { Wrapper as EditorWrapper } from '../rich-text-editor/style';

export const ChatInputContainer = styled(FlexRow)`
  flex: none;
  display: flex;
  flex-direction: column;
  z-index: inherit;
  position: relative;
  width: 100%;
  margin: 0;

  a {
    text-decoration: underline;
  }
`;

export const ChatInputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  width: 100%;
  margin: 0;
  padding: 8px 8px 0 4px;
  background-color: ${props => props.theme.bg.default};
  border-top: 1px solid ${({ theme }) => theme.bg.border};
  box-shadow: -1px 0 0 ${props => props.theme.bg.border},
    1px 0 0 ${props => props.theme.bg.border};

  @media (max-width: 768px) {
    bottom: ${props => (props.focus ? '0' : 'auto')};
    position: relative;
    z-index: ${zIndex.mobileInput};
    padding: 8px;
  }
`;

export const Form = styled.form`
  flex: auto;
  display: flex;
  min-width: 1px;
  max-width: 100%;
  align-items: center;
  margin-left: 4px;
  border-radius: 24px;
  background-color: transparent;
  position: relative;
`;

export const InputWrapper = styled(EditorWrapper)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex: auto;
  font-size: 15px;
  font-weight: 500;
  line-height: 20px;
  min-height: 40px;
  max-width: calc(100% - 32px);
  padding: ${props => (props.hasAttachment ? '16px' : '8px 16px')};
  transition: padding 0.2s ease-in-out;
  border-radius: 24px;
  border: 1px solid
    ${props =>
      props.networkDisabled
        ? props.theme.special.default
        : props.theme.bg.border};
  transition: border 0.3s ease-out;
  color: ${props =>
    props.networkDisabled
      ? props.theme.special.default
      : props.theme.text.default};
  background: ${props =>
    props.networkDisabled
      ? hexa(props.theme.special.default, 0.1)
      : props.theme.bg.default};

  @media (max-width: 768px) {
    font-size: 16px;
    padding-left: 16px;
    ${/* width: calc(100% - 72px); */ ''};
  }

  &::placeholder {
    color: ${props =>
      props.networkDisabled
        ? hexa(props.theme.special.default, 0.5)
        : props.theme.text.placeholder};
  }
  &::-webkit-input-placeholder {
    color: ${props =>
      props.networkDisabled
        ? hexa(props.theme.special.default, 0.5)
        : props.theme.text.placeholder};
  }
  &:-moz-placeholder {
    color: ${props =>
      props.networkDisabled
        ? hexa(props.theme.special.default, 0.5)
        : props.theme.text.placeholder};
  }
  &:-ms-input-placeholder {
    color: ${props =>
      props.networkDisabled
        ? hexa(props.theme.special.default, 0.5)
        : props.theme.text.placeholder};
  }

  &:hover {
    border-color: ${props =>
      props.networkDisabled
        ? props.theme.special.default
        : props.theme.text.alt};
    transition: border-color 0.2s ease-in;
  }

  pre {
    ${monoStack};
    font-size: 15px;
    font-weight: 500;
    background-color: ${props => props.theme.bg.wash};
    border: 1px solid ${props => props.theme.bg.border};
    border-radius: 2px;
    padding: 4px;
    margin-right: 16px;
  }

  ${props =>
    props.hasAttachment &&
    css`
      > div:not(:first-of-type) {
        margin-top: 16px;
      }

      > div:last-of-type {
        margin-right: 32px;
      }
    `};
`;

export const SendButton = styled(IconButton)`
  height: 32px;
  width: 32px;
  bottom: 4px;
  margin-left: 4px;
  background-color: transparent;
  transition: ${Transition.hover.off};
  align-self: flex-end;
  z-index: ${zIndex.chatInput};
`;

export const MediaInput = styled.input`
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: ${zIndex.hidden};
`;

export const MediaLabel = styled.label`
  border: none;
  outline: 0;
  display: inline-block;
  background: transparent;
  transition: color 0.3s ease-out;
  border-radius: 4px;
  padding: 4px;
  position: relative;
  top: 2px;
  color: ${({ theme }) => theme.text.alt};

  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.brand.default};
  }
`;

export const EmojiToggle = styled(IconButton)`
  position: absolute;
  left: 56px;
  background-color: transparent;
  top: calc(50% - 16px);

  @media (max-width: 768px) {
    display: none;
  }
`;

export const PhotoSizeError = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  padding: 8px 16px;
  width: 100%;
  background: ${props => props.theme.special.wash};
  border-top: 1px solid ${props => props.theme.special.border};

  &:hover {
    cursor: pointer;

    p {
      color: ${props => props.theme.brand.default};
    }
  }

  p {
    font-size: 14px;
    line-height: 1.4;
    color: ${props => props.theme.special.default};
    max-width: calc(100% - 48px);
  }

  div {
    align-self: center;
  }
`;

export const RemovePreviewButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  vertical-align: top;
  background-color: ${props => props.theme.text.placeholder};
  color: ${props => props.theme.text.reverse};
  border: none;
  border-radius: 100%;
  outline: none;
  padding: 4px;
  max-height: 24px;
  max-width: 24px;
  cursor: pointer;
  z-index: 1;

  &:hover {
    background-color: ${props => props.theme.warn.alt};
  }
`;

export const PreviewWrapper = styled.div`
  position: relative;
  padding: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid ${props => props.theme.bg.border};

  ${QuoteWrapper} {
    margin: 0;
    margin-top: -6px;
    margin-left: -12px;
  }

  & > img {
    border-radius: 8px;
    max-width: 37%;
  }
`;

export const Preformatted = styled.code`
  background-color: ${props => props.theme.bg.wash};
  border: 1px solid ${props => props.theme.bg.border};
  white-space: nowrap;
`;

export const MarkdownHint = styled.div`
  display: flex;
  flex: 0 0 auto;
  justify-content: flex-end;
  margin-right: 12px;
  font-size: 11px;
  color: ${props => props.theme.text.alt};
  line-height: 1;
  padding: 6px 0;
  opacity: ${({ showHint }) => (showHint ? 1 : 0)};
  transition: opacity 200ms ease-in-out;
  b {
    font-weight: 600;
  }
  i,
  b,
  code {
    margin-right: 3px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;
