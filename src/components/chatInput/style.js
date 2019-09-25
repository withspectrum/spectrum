// @flow
import theme from 'shared/theme';
import styled, { css } from 'styled-components';
import MentionsInput from '../mentionsInput';
import { QuoteWrapper } from '../message/style';
import { MEDIA_BREAK } from 'src/components/layout';
import { FlexRow, hexa, zIndex, monoStack } from 'src/components/globals';

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
  padding: 8px 12px 0 12px;
  background-color: ${theme.bg.default};
  border-top: 1px solid ${theme.bg.border};
  box-shadow: -1px 0 0 ${theme.bg.border}, 1px 0 0 ${theme.bg.border};

  @media (max-width: ${MEDIA_BREAK}px) {
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

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex: auto;
  padding: ${props => (props.hasAttachment ? '16px' : '9px 16px 8px 16px')};
  transition: padding 0.2s ease-in-out;
  min-height: 40px;
  max-width: calc(100% - 32px);
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
      : props.theme.text.secondary};
  background: ${props =>
    props.networkDisabled
      ? hexa(props.theme.special.default, 0.1)
      : props.theme.bg.default};

  &:hover,
  &:focus {
    border-color: ${props =>
      props.networkDisabled
        ? props.theme.special.default
        : props.theme.text.alt};
    transition: border-color 0.2s ease-in;
  }

  @media (max-width: ${MEDIA_BREAK}px) {
    padding-left: 16px;
  }
`;

export const Input = styled(MentionsInput).attrs(props => ({
  dataCy: props.dataCy || 'chat-input',
  spellCheck: true,
  autoCapitalize: 'sentences',
  autoComplete: 'on',
  autoCorrect: 'on',
}))`
  font-size: 16px; /* has to be 16px to avoid zoom on iOS */
  font-weight: 400;
  line-height: 1.4;
  background: ${props =>
    props.networkDisabled ? 'none' : props.theme.bg.default};

  @media (max-width: ${MEDIA_BREAK}px) {
    font-size: 16px;
  }

  div,
  textarea {
    line-height: 1.4 !important;
    word-break: break-word;
  }

  &::placeholder {
    color: ${props =>
      props.networkDisabled
        ? hexa(props.theme.special.default, 0.8)
        : props.theme.text.placeholder};
  }
  &::-webkit-input-placeholder {
    color: ${props =>
      props.networkDisabled
        ? hexa(props.theme.special.default, 0.8)
        : props.theme.text.placeholder};
  }
  &:-moz-placeholder {
    color: ${props =>
      props.networkDisabled
        ? hexa(props.theme.special.default, 0.8)
        : props.theme.text.placeholder};
  }
  &:-ms-input-placeholder {
    color: ${props =>
      props.networkDisabled
        ? hexa(props.theme.special.default, 0.8)
        : props.theme.text.placeholder};
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

  ${props =>
    props.hasAttachment &&
    css`
      margin-top: 16px;
      ${'' /* > div:last-of-type {
        margin-right: 32px;
      } */};
    `};
`;

export const MediaInput = styled.input`
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
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
  color: ${theme.text.alt};

  &:hover {
    cursor: pointer;
    color: ${theme.brand.default};
  }
`;

export const PhotoSizeError = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  padding: 8px 16px;
  width: 100%;
  background: ${theme.special.wash};
  border-top: 1px solid ${theme.special.border};

  &:hover {
    cursor: pointer;

    p {
      color: ${theme.brand.default};
    }
  }

  p {
    font-size: 14px;
    line-height: 1.4;
    color: ${theme.special.default};
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
  background-color: ${theme.text.placeholder};
  color: ${theme.text.reverse};
  border: none;
  border-radius: 100%;
  outline: none;
  padding: 4px;
  max-height: 24px;
  max-width: 24px;
  cursor: pointer;
  z-index: 1;

  &:hover {
    background-color: ${theme.warn.alt};
  }
`;

export const PreviewWrapper = styled.div`
  position: relative;
  padding: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid ${theme.bg.border};

  ${QuoteWrapper} {
    margin: 0;
    margin-top: -6px;
    margin-left: -12px;
    border-left: 0;
  }

  & + & {
    padding-top: 16px;

    ${RemovePreviewButton} {
      top: 16px;
    }
  }

  & > img {
    border-radius: 8px;
    max-width: 37%;
  }
`;
