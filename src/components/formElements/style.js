import styled, { css } from 'styled-components';
import theme from 'shared/theme';
import { FlexRow, Transition, hexa, zIndex } from '../globals';
import Textarea from 'react-textarea-autosize';

export const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 12px;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: -0.4px;
  color: ${theme.text.default};
  transition: ${Transition.hover.off};
  position: relative;

  a {
    text-decoration: underline;
  }

  &:hover > input,
  &:hover > textarea {
    border-color: ${props =>
      props.disabled ? props.theme.bg.border : props.theme.text.alt};
    transition: ${Transition.hover.on};
  }

  &:hover > input:focus,
  &:hover > textarea:focus {
    border-color: ${props =>
      props.disabled ? props.theme.bg.inactive : props.theme.brand.alt};
  }
`;

export const StyledPrefixLabel = styled.label`
  display: flex;
  width: 100%;
  margin-top: 4px;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.text.placeholder};
  white-space: nowrap;
  text-overflow: ellipsis;

  > input {
    margin-left: 2px;
  }

  &:hover > input {
    border-color: ${props =>
      props.disabled ? props.theme.bg.inactive : props.theme.text.alt};
    transition: ${Transition.hover.on};
  }
`;

export const StyledInput = styled.input`
  flex: 1 0 auto;
  background: ${props =>
    props.disabled ? props.theme.bg.wash : props.theme.bg.default};
  font-weight: 500;
  width: 100%;
  font-size: 14px;
  border: 2px solid
    ${props =>
      props.disabled ? props.theme.bg.border : props.theme.bg.inactive};
  border-radius: 4px;
  padding: 8px 12px;
  margin-top: 2px;
  box-shadow: none;
  transition: ${Transition.hover.off};

  ${props =>
    props.type === 'checkbox' &&
    css`
      flex: initial;
      width: initial;
      margin-right: 0.5em;
    `} &::placeholder {
    color: ${theme.text.placeholder};
  }
  &::-webkit-input-placeholder {
    color: ${theme.text.placeholder};
  }
  &:-moz-placeholder {
    color: ${theme.text.placeholder};
  }
  &:-ms-input-placeholder {
    color: ${theme.text.placeholder};
  }

  &:focus {
    border-color: ${theme.brand.default};
    transition: ${Transition.hover.on};
  }

  &[type='file'] {
    position: absolute;
    left: -9999px;
    top: -9999px;
    visibility: hidden;
  }
`;

export const StyledTextArea = styled(Textarea)`
  flex: 1 0 auto;
  width: 100%;
  background: ${theme.bg.default};
  font-weight: 500;
  font-size: 14px;
  border: 2px solid ${theme.bg.inactive};
  border-radius: 4px;
  padding: 12px;
  margin-top: 2px;
  box-shadow: none;
  transition: ${Transition.hover.off};

  &::placeholder {
    color: ${theme.text.placeholder};
  }
  &::-webkit-input-placeholder {
    color: ${theme.text.placeholder};
  }
  &:-moz-placeholder {
    color: ${theme.text.placeholder};
  }
  &:-ms-input-placeholder {
    color: ${theme.text.placeholder};
  }

  &:focus {
    border-color: ${theme.brand.default};
    transition: ${Transition.hover.on};
  }
`;

export const StyledUnderlineInput = styled.input`
  font-size: inherit;
  font-weight: inherit;
  color: ${props =>
    props.disabled ? props.theme.text.alt : props.theme.text.default};
  border-bottom: ${props =>
    props.disabled
      ? '2px solid transparent'
      : `2px solid ${props.theme.bg.inactive}`};
  width: 50%;
  transition: ${Transition.hover.off};

  &:hover {
    border-color: ${props => (props.disabled ? 'transparent' : 'inherit')};
    transition: ${Transition.hover.on};
  }

  &:focus {
    border-color: ${theme.brand.default};
    transition: ${Transition.hover.on};
  }
`;

export const StyledHiddenInput = styled.input`
  visibility: hidden;
  width: 0;
  height: 0;
`;

export const StyledCheckboxWrapper = styled(FlexRow)`
  color: ${theme.text.alt};
  display: flex;
  align-items: ${props => props.align};
  line-height: 1.4;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    color: ${({ theme, disabled }) =>
      disabled ? theme.text.alt : theme.brand.alt};
  }

  > div {
    margin-left: -6px;
    margin-right: 6px;
  }

  > a {
    text-decoration: none;
    color: ${theme.brand.alt};
    font-weight: 600;
    border-bottom: 2px solid transparent;
    position: relative;
    padding-bottom: 0px;
    transition: ${Transition.hover.off};

    &:hover {
      border-bottom: 2px solid ${theme.brand.alt};
      padding-bottom: 2px;
      transition: ${Transition.hover.on};
    }
  }
`;

export const StyledError = styled.p`
  font-size: 14px;
  color: ${theme.warn.default};
  padding: 8px 0 16px;
  line-height: 1.4;
  font-weight: 600;

  a {
    text-decoration: underline;
  }
`;

export const StyledSuccess = styled.p`
  font-size: 14px;
  color: ${theme.success.default};
  padding: 8px 0 16px;
  line-height: 1.4;
  font-weight: 600;
`;

export const PhotoInputLabel = styled.label`
  position: relative;
  height: ${props => `${props.size}px`};
  z-index: ${zIndex.form + 1};
  width: ${props => `${props.size}px`};
  border-radius: ${props =>
    props.type === 'user' ? `${props.size}px` : '8px'};
  margin-top: 8px;
  background-color: ${theme.bg.reverse};
`;

export const PhotoInputImage = styled.img`
  width: ${props => `${props.size}px`};
  height: ${props => `${props.size}px`};
  border-radius: ${props =>
    props.type === 'user' ? `${props.size}px` : '8px'};
  box-shadow: 0 0 0 2px ${theme.bg.default};
`;

export const CoverInputLabel = styled.label`
  position: relative;
  height: 114px;
  max-width: 342px;
  z-index: ${zIndex.form};
  width: 100%;
  margin-top: 8px;
  border-radius: 8px;
  background-color: ${theme.bg.reverse};
`;

export const ProfileImage = styled.img`
  position: absolute;
  object-fit: cover;
  z-index: ${zIndex.form + 1};
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: ${props =>
    props.type === 'user' ? `${props.size}px` : '8px'};
  border: 2px solid ${theme.text.reverse};
`;

export const CoverImage = styled.div`
  background-color: ${theme.brand.default};
  background-image: url('${props => props.src}');
  background-position: center;
  background-size: cover;
  position: absolute;
  z-index: ${zIndex.form};
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 114px;
  border-radius: 8px;
`;

export const InputOverlay = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${zIndex.form + 2};
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: ${theme.text.reverse};
  background-color: ${({ theme }) => hexa(theme.bg.reverse, 0.6)};
  padding: 8px;
  border-radius: ${props =>
    props.type === 'user' ? `${props.size}px` : '8px'};
  opacity: ${props => (props.visible ? '1' : '0')};
  transition: ${Transition.hover.off};

  &:hover {
    opacity: 1;
    transition: ${Transition.hover.on};

    + img,
    + div {
      transition: ${Transition.hover.on};
      opacity: 0.25;
    }
  }

  &:hover div {
    transition: ${Transition.hover.on};
  }
`;
