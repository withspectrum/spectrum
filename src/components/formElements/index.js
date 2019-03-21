// @flow
import * as React from 'react';
import Icon from 'src/components/icon';
import { WhiteOutlineButton } from 'src/components/button';
import type { GetUserType } from 'shared/graphql/queries/user/getUser';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';

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
  PhotoInputImage,
} from './style';

type InputProps = {
  children?: React$Node,
  inputType?: string,
  defaultValue?: ?string,
  value?: ?any,
  placeholder?: string,
  onChange?: Function,
  autoFocus?: boolean,
  checked?: boolean,
  disabled?: boolean,
  id?: string,
  dataCy?: string,
  user?: GetUserType,
  community?: GetCommunityType,
  size?: number,
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
        data-cy={props.dataCy}
      />
    </StyledLabel>
  );
};

type PhotoInputProps = {
  size?: number,
  type: 'user' | 'community',
  defaultValue: string,
  onChange: Function,
  dataCy?: string,
};

export const PhotoInput = (props: PhotoInputProps) => {
  const { size = 48, type, defaultValue, onChange, dataCy } = props;

  let visible,
    src = defaultValue;
  if (!src || src.length === 0) {
    visible = true;
    src =
      type === 'user'
        ? '/img/default_avatar.svg'
        : '/img/default_community.svg';
  }

  return (
    <PhotoInputLabel type={type} size={size}>
      <InputOverlay type={type} size={size} visible={visible}>
        <Icon glyph="photo" />
      </InputOverlay>

      <PhotoInputImage
        type={type}
        alt={'Profile photo'}
        src={src}
        size={size}
      />

      <StyledHiddenInput
        type="file"
        id="file"
        name="file"
        accept={'.png, .jpg, .jpeg'}
        multiple={false}
        onChange={onChange}
        data-cy={dataCy}
      />
    </PhotoInputLabel>
  );
};

type CoverPhotoInputProps = {
  defaultValue: string,
  onChange: Function,
  dataCy?: string,
};

export const CoverInput = (props: CoverPhotoInputProps) => {
  return (
    <CoverInputLabel>
      <InputOverlay
        visible={!props.defaultValue || props.defaultValue.length === 1}
      >
        <WhiteOutlineButton as={'div'}>Add Cover Photo</WhiteOutlineButton>
      </InputOverlay>
      <CoverImage
        src={props.defaultValue ? `${props.defaultValue}` : ''}
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
        data-cy={props.dataCy}
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
        data-cy={
          props.dataCy
            ? `${props.dataCy}-${props.checked ? 'checked' : 'unchecked'}`
            : null
        }
      >
        {props.checked ? <Icon glyph="checkmark" /> : <Icon glyph="checkbox" />}
        <StyledHiddenInput
          type="checkbox"
          id={props.id}
          checked={props.checked}
          disabled={props.disabled || false}
          onChange={props.onChange}
          data-cy={props.dataCy}
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
        data-cy={props.dataCy}
      />
    </StyledLabel>
  );
};

export class UnderlineInput extends React.Component<InputProps> {
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
          data-cy={this.props.dataCy}
        />
      </StyledPrefixLabel>
    );
  }
}

export const Error = (props: Object) => {
  const { children, ...rest } = props;
  return <StyledError {...rest}>{children}</StyledError>;
};

export const Success = (props: Object) => {
  const { children, ...rest } = props;
  return <StyledSuccess {...rest}>{children}</StyledSuccess>;
};
