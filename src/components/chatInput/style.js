// @flow
import styled, { css } from 'styled-components';
import { IconButton } from '../buttons';
import {
  FlexRow,
  hexa,
  Transition,
  zIndex,
  monoStack,
} from 'src/components/globals';
import { Wrapper as EditorWrapper } from '../draftjs-editor/style';

export const ChatInputWrapper = styled(FlexRow)`
  flex: none;
  align-items: center;
  z-index: inherit;
  position: relative;
  width: 100%;
  margin: 0;
  padding: 8px;
  background-color: ${props => props.theme.bg.default};
  border-top: 1px solid ${({ theme }) => theme.bg.border};
  box-shadow: -1px 0 0 ${props => props.theme.bg.border},
    1px 0 0 ${props => props.theme.bg.border};

  @media (max-width: 768px) {
    bottom: ${props => (props.focus ? '0' : 'auto')};
    position: relative;
    z-index: ${zIndex.mobileInput};
  }

  a {
    text-decoration: underline;
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
  flex: auto;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  min-height: 40px;
  max-width: 100%;
  padding: 8px 40px 8px 16px;
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
    font-size: 14px;
    font-weight: 500;
    background-color: #f5f8fc;
  }
`;

export const SendButton = styled(IconButton)`
  position: absolute;
  right: 12px;
  height: 32px;
  width: 32px;
  background-color: transparent;
  transition: ${Transition.hover.off};
  top: calc(50% - 16px);
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
  transition: all 0.3s ease-out;
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
  background: #fff1cc;
  border-top: 1px solid #ffd566;

  &:hover {
    cursor: pointer;

    p {
      color: ${props => props.theme.brand.default};
    }
  }

  p {
    font-size: 14px;
    line-height: 1.4;
    color: #715818;
    max-width: calc(100% - 48px);
  }

  div {
    align-self: center;
  }
`;

export const MediaPreview = styled.div`
  padding-top: 8px;
  padding-bottom: 10px;

  & > img {
    border-radius: 16px;
    max-width: 37%;
  }

  button {
    position: relative;
    top: -5px;
    left: -25px;
    vertical-align: top;
    background: #16171a;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
    transition: box-shadow 0.3s ease-in-out;
    border: none;
    border-radius: 40px;
    outline: none;
    width: 32px;
    height: 32px;
    cursor: pointer;
  }

  button:after {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    content: '\\d7';
    font-size: 21px;
    color: #fff;
    line-height: 28px;
    text-align: center;
  }

  button:hover {
    box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.15);
  }
`;
