// @flow
import React from 'react';
// $FlowFixMe
import styled from 'styled-components';
import { Transition } from '../../../../components/globals';

export const Row = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
`;

export const Loading = styled.span`
  position: absolute;
  left: calc(100% - 24px);
  top: 50%;
`;

export const Action = styled.div`
  margin-top: 14px;
  margin-left: 8px;
`;

export const Form = styled.form`
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  margin-top: 32px;
`;

export const InputLabel = styled.h3`
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.text.default};
  margin-bottom: 8px;
`;

export const InputSubLabel = styled.h4`
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.text.alt};
  margin-bottom: 16px;
  line-height: 1.4;
`;

export const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: -0.4px;
  color: ${({ theme }) => theme.text.default};
  transition: ${Transition.hover.off};
  position: relative;

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
  font-size: 18px;
  border: 2px solid
    ${props =>
      props.disabled ? props.theme.bg.border : props.theme.bg.inactive};
  border-radius: 8px;
  padding: 12px 24px;
  margin-top: 2px;
  text-align: center;
  box-shadow: none;
  transition: ${Transition.hover.off};

  &::placeholder {
    color: ${({ theme }) => theme.text.placeholder};
  }
  &::-webkit-input-placeholder {
    color: ${({ theme }) => theme.text.placeholder};
  }
  &:-moz-placeholder {
    color: ${({ theme }) => theme.text.placeholder};
  }
  &:-ms-input-placeholder {
    color: ${({ theme }) => theme.text.placeholder};
  }

  &:focus {
    border-color: ${({ theme }) => theme.brand.default};
    transition: ${Transition.hover.on};
  }
`;

export const Input = props => {
  return (
    <StyledLabel {...props}>
      {props.children}
      <StyledInput
        id={props.id}
        type={props.inputType}
        defaultValue={props.defaultValue}
        placeholder={props.placeholder}
        onChange={props.onChange}
        autoFocus={props.autoFocus}
        disabled={props.disabled}
      />
    </StyledLabel>
  );
};
