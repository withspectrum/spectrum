import styled, { css } from 'styled-components';
import { Transition } from '../globals';

export const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 16px;
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
    border-color: ${({ theme }) => theme.text.alt};
    transition: ${Transition.hover.on};
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
    border-color: ${({ theme }) => theme.text.alt};
    transition: ${Transition.hover.on};
  }
`;

export const StyledInput = styled.input`
  flex: 1 0 auto;
  background: ${({ theme }) => theme.bg.default};
  font-weight: 500;
  width: 100%;
  font-size: 14px;
  border: 2px solid ${({ theme }) => theme.inactive};
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
		color: ${({ theme }) => theme.text.default};
    border-bottom: 2px solid ${({ theme }) => theme.inactive};
    flex: 1 0 auto;
    transition: ${Transition.hover.off};

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
