import styled, { css } from 'styled-components';
import { Transition } from '../globals';

export const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 12px;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: -0.4px;
  color: ${({ theme }) => theme.text.default};
  transition: ${Transition.hover.off};

  a {
    text-decoration: underline;
  }

  &:hover > input,
  &:hover > textarea {
    border-color: ${props => (props.disabled ? props.theme.border.default : props.theme.text.alt)};
    transition: ${Transition.hover.on};
  }

  &:hover > input:focus,
  &:hover > textarea:focus {
    border-color: ${props => (props.disabled ? props.theme.inactive : props.theme.brand.alt)};
  }
`;

export const StyledPrefixLabel = styled.label`
  display: flex;
  width: 100%;
  margin-top: 4px;
  padding-left: 14px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.placeholder};

  > input {
  	margin-left: 2px;
  }

  &:hover > input {
    border-color: ${props => (props.disabled ? props.theme.inactive : props.theme.text.alt)};
    transition: ${Transition.hover.on};
  }
`;

export const StyledInput = styled.input`
  flex: 1 0 auto;
  background: ${props => (props.disabled ? props.theme.bg.wash : props.theme.bg.default)};
  font-weight: 500;
  width: 100%;
  font-size: 14px;
  border: 2px solid ${props => (props.disabled ? props.theme.border.default : props.theme.inactive)};
  border-radius: 4px;
  padding: 8px 12px;
  margin-top: 2px;
  box-shadow: none;
  transition: ${Transition.hover.off};

  ${props => props.type === 'checkbox' && css`
    flex: initial;
    width: initial;
    margin-right: 0.5em;
  `}

  &::placeholder { color: ${({ theme }) => theme.text.placeholder} }
  &::-webkit-input-placeholder { color: ${({ theme }) => theme.text.placeholder} }
  &:-moz-placeholder { color: ${({ theme }) => theme.text.placeholder} }
  &:-ms-input-placeholder { color: ${({ theme }) => theme.text.placeholder} }

  &:focus {
    border-color: ${({ theme }) => theme.brand.default};
    transition: ${Transition.hover.on};
  }

  &[type="file"] {
    position: absolute;
    left: -9999px;
    top: -9999px;
    visibility: hidden;
  }
`;

export const StyledTextArea = styled.textarea`
	flex: 1 0 auto;
	width: 100%;
  background: ${({ theme }) => theme.bg.default};
  font-weight: 500;
  font-size: 14px;
  border: 2px solid ${({ theme }) => theme.inactive};
  border-radius: 4px;
  padding: 12px;
  margin-top: 2px;
  box-shadow: none;
  transition: ${Transition.hover.off};

  &::placeholder { color: ${({ theme }) => theme.text.placeholder} }
  &::-webkit-input-placeholder { color: ${({ theme }) => theme.text.placeholder} }
  &:-moz-placeholder { color: ${({ theme }) => theme.text.placeholder} }
  &:-ms-input-placeholder { color: ${({ theme }) => theme.text.placeholder} }

  &:focus {
    border-color: ${({ theme }) => theme.brand.default};
    transition: ${Transition.hover.on};
  }
`;

export const StyledUnderlineInput = styled.input`
	font-size: inherit;
	font-weight: inherit;
	color: ${props => (props.disabled ? props.theme.text.placeholder : props.theme.text.default)};
  border-bottom: ${props => (props.disabled ? '2px solid transparent' : `2px solid ${props.theme.inactive}`)};
  flex: 1 0 auto;
  transition: ${Transition.hover.off};

  &:hover {
    border-color: ${props => (props.disabled ? 'transparent' : 'inherit')};
    transition: ${Transition.hover.on}
  }

  &:focus {
    border-color: ${({ theme }) => theme.brand.default};
    transition: ${Transition.hover.on};
  }
`;

export const StyledHiddenInput = styled.input`
  visibility: hidden;
  width: 0;
  height: 0;
`;

export const StyledCheckboxWrapper = styled.span`
  color: ${({ theme }) => theme.text.alt};

  &:hover {
    color: ${({ theme }) => theme.brand.alt};
  }

  > div {
    vertical-align: middle;
    margin-left: -6px;
  }

  > a {
    text-decoration: none;
    color: ${({ theme }) => theme.brand.alt};
    font-weight: 600;
    border-bottom: 2px solid transparent;
    position: relative;
    padding-bottom: 0px;
    transition: ${Transition.hover.off};

    &:hover {
      border-bottom: 2px solid ${({ theme }) => theme.brand.alt};
      padding-bottom: 2px;
      transition: ${Transition.hover.on};
    }
  }
`;

export const StyledError = styled.p`
  font-size: 14px;
  color: ${props => props.theme.warn.default};
  padding: 8px 0 16px;
  line-height: 1.4;
`;

export const PhotoInputLabel = styled.label`
  position: relative;
  height: 48px;
  width: 48px;
  border-radius: 8px;
  margin-top: 8px;
  background-color: ${({ theme }) => theme.brand.alt};
`;

export const CoverInputLabel = styled.label`
  position: relative;
  height: 96px;
  width: 100%;
  margin-top: 8px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.bg.reverse};
`;

export const ProfileImage = styled.img`
  position: absolute;
  object-fit: cover;
  z-index: 9;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.text.reverse};
`;

export const CoverImage = styled.div`
  background-image: url('${props => props.src}');
  background-position: center;
  background-size: cover;
  position: absolute;
  z-index: 9;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 96px;
  border-radius: 8px;

  &:hover {
    opacity: 0.25;
  }
`;

export const InputOverlay = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.text.reverse};
  padding: 8px;
  border-radius: 8px;

  div {
    transition: ${Transition.hover.off};
    opacity: 0;
  }

  &:hover div {
    transition: ${Transition.hover.on};
    opacity: 1;
  }
`;
