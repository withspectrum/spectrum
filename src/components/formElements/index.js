//@flow
import React from 'react';

import Icon from '../icons';
import {
  StyledLabel,
  StyledPrefixLabel,
  StyledInput,
  StyledTextArea,
  StyledUnderlineInput,
  StyledHiddenInput,
  StyledCheckboxWrapper,
} from './style';

type InputProps = {
  children?: React$Element<any>,
  inputType?: String,
  defaultValue?: String,
  placeholder?: String,
  onChange?: Function,
  autofocus?: Boolean,
  checked?: Boolean,
  disabled: ?Boolean,
};

export const Input = (props: InputProps) => {
  return (
    <StyledLabel>
      {props.children}
      <StyledInput
        type={props.inputType}
        defaultValue={props.defaultValue}
        placeholder={props.placeholder}
        onChange={props.onChange}
        autofocus={props.autofocus}
      />
    </StyledLabel>
  );
};

export const Checkbox = (props: InputProps) => {
  return (
    <StyledLabel>
      <StyledCheckboxWrapper>
        {props.checked
          ? <Icon
              icon="checked"
              color="success.default"
              hoverColor="success.default"
              scaleOnHover={true}
            />
          : <Icon
              icon="unchecked"
              color="text.alt"
              hoverColor="brand.alt"
              scaleOnHover={true}
            />}
        <StyledHiddenInput
          type="checkbox"
          checked={props.checked}
          onChange={props.onChange}
        />
        {props.children}
      </StyledCheckboxWrapper>
    </StyledLabel>
  );
};

export const TextArea = (props: InputProps) => {
  return (
    <StyledLabel>
      {props.children}
      <StyledTextArea
        placeholder={props.placeholder}
        defaultValue={props.defaultValue}
        onChange={props.onChange}
        autofocus={props.autofocus}
      />
    </StyledLabel>
  );
};

export const UnderlineInput = (props: InputProps) => {
  return (
    <StyledPrefixLabel disabled={props.disabled}>
      {props.children}
      <StyledUnderlineInput
        type="text"
        placeholder={props.placeholder}
        defaultValue={props.defaultValue}
        onChange={props.onChange}
        autofocus={props.autofocus}
        disabled={props.disabled}
      />
    </StyledPrefixLabel>
  );
};
