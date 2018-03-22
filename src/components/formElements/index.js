import * as React from 'react';
import Avatar from '../avatar';
import Icon from '../icons';
import { FauxOutlineButton } from '../buttons';

import {
  StyledLabel,
  StyledPrefixLabel,
  StyledInput,
  StyledTextArea,
  StyledUnderlineInput,
  StyledHiddenInput,
  StyledCheckboxWrapper,
  StyledError,
  StyledSuccess,
  PhotoInputLabel,
  CoverInputLabel,
  InputOverlay,
  CoverImage,
} from './style';

type InputProps = {
  children?: React.Node,
  inputType?: string,
  defaultValue?: ?string,
  value?: ?any,
  placeholder?: string,
  onChange?: Function,
  autoFocus?: boolean,
  checked?: boolean,
  disabled?: boolean,
  id?: string,
  'e2e-id'?: string,
};

export const Input = (props: InputProps) => {
  return (
    <StyledLabel {...props}>
      {props.children}
      <StyledInput
        id={props.id}
        type={props.inputType}
        defaultValue={props.defaultValue}
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
        autoFocus={props.autoFocus}
        disabled={props.disabled}
        data-e2e-id={props['e2e-id']}
      />
    </StyledLabel>
  );
};

export const PhotoInput = (props: InputProps) => {
  return (
    <PhotoInputLabel user={props.user} size={props.size || 48}>
      <InputOverlay user={props.user}>
        <Icon glyph="photo" />
      </InputOverlay>
      <Avatar
        style={{ boxShadow: '0 0 0 2px white' }}
        size={props.size || 48}
        src={`${props.defaultValue}`}
        user={props.user}
        community={props.community}
      />
      <StyledHiddenInput
        type="file"
        id="file"
        name="file"
        accept={
          props.allowGif ? '.png, .jpg, .jpeg, .gif, .mp4' : '.png, .jpg, .jpeg'
        }
        multiple={false}
        onChange={props.onChange}
        data-e2e-id={props['e2e-id']}
      />
    </PhotoInputLabel>
  );
};

export const CoverInput = (props: InputProps) => {
  return (
    <CoverInputLabel>
      <InputOverlay>
        <FauxOutlineButton
          color={'bg.default'}
          hoverColor={'bg.default'}
          icon={'photo'}
        >
          Add Cover Photo
        </FauxOutlineButton>
      </InputOverlay>
      <CoverImage
        src={`${props.defaultValue}${props.preview ? '' : '?w=320&dpr=2'}`}
        role="presentation"
      />
      <StyledHiddenInput
        type="file"
        id="file"
        name="file"
        accept={
          props.allowGif ? '.png, .jpg, .jpeg, .gif, .mp4' : '.png, .jpg, .jpeg'
        }
        multiple={false}
        onChange={props.onChange}
        data-e2e-id={props['e2e-id']}
      />
    </CoverInputLabel>
  );
};

export const Checkbox = (props: InputProps) => {
  return (
    <StyledLabel>
      <StyledCheckboxWrapper
        disabled={props.disabled || false}
        align={props.align || 'center'}
      >
        {props.checked ? <Icon glyph="checkmark" /> : <Icon glyph="checkbox" />}
        <StyledHiddenInput
          type="checkbox"
          id={props.id}
          checked={props.checked}
          disabled={props.disabled || false}
          onChange={props.onChange}
          data-e2e-id={props['e2e-id']}
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
        id={props.id}
        placeholder={props.placeholder}
        defaultValue={props.defaultValue}
        onChange={props.onChange}
        autoFocus={props.autoFocus}
        data-e2e-id={props['e2e-id']}
      />
    </StyledLabel>
  );
};

export class UnderlineInput extends React.Component {
  render() {
    return (
      <StyledPrefixLabel disabled={this.props.disabled}>
        {this.props.children}
        <StyledUnderlineInput
          type="text"
          id={this.props.id}
          placeholder={this.props.placeholder}
          value={this.props.value || this.props.defaultValue}
          onChange={this.props.onChange}
          autoFocus={this.props.autoFocus}
          disabled={this.props.disabled}
          data-e2e-id={this.props['e2e-id']}
        />
      </StyledPrefixLabel>
    );
  }
}

export const Error = ({ children, ...rest }) => {
  return <StyledError {...rest}>{children}</StyledError>;
};

export const Success = (props: Object) => {
  return <StyledSuccess>{props.children}</StyledSuccess>;
};
