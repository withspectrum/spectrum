import React from 'react';
import theme from 'shared/theme';
// $FlowFixMe
import styled from 'styled-components';
import { Transition } from '../globals';

export const Loading = styled.span`
  position: absolute;
  left: calc(100% - 24px);
  top: ${props => (props.size === 'small' ? 'calc(50% + 12px)' : '50%')};
`;

export const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: -0.4px;
  color: ${theme.text.default};
  transition: ${Transition.hover.off};
  position: relative;
  margin-top: ${props => (props.size === 'small' ? '12px' : 0)};

  &:hover > input {
    border-color: ${props =>
      props.disabled ? props.theme.bg.border : props.theme.text.alt};
    transition: ${Transition.hover.on};
  }

  &:hover > input:focus {
    border-color: ${props =>
      props.disabled ? props.theme.bg.inactive : props.theme.brand.alt};
  }
`;

export const StyledInput = styled.input`
  flex: 1 0 auto;
  background: ${props =>
    props.disabled ? props.theme.bg.wash : props.theme.bg.default};
  font-weight: 500;
  width: 100%;
  font-size: ${props => (props.size === 'small' ? '14px' : '18px')};
  border: 2px solid
    ${props =>
      props.disabled ? props.theme.bg.border : props.theme.bg.inactive};
  border-radius: ${props => (props.size === 'small' ? '4px' : '8px')};
  padding: ${props => (props.size === 'small' ? '8px 12px' : '12px 24px')};
  margin-top: 2px;
  text-align: ${props => (props.size === 'small' ? 'left' : 'center')};
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

export const Input = props => {
  const { dataCy, ...rest } = props;
  return (
    <StyledLabel {...rest}>
      {props.children}
      <StyledInput
        id={props.id}
        type={props.inputType}
        defaultValue={props.defaultValue}
        placeholder={props.placeholder}
        onChange={props.onChange}
        autoFocus={props.autoFocus}
        disabled={props.disabled}
        size={props.size}
        data-cy={dataCy}
      />
    </StyledLabel>
  );
};
