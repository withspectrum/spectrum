// @flow
import * as React from 'react';
import {
  StyledButton,
  StyledPrimaryButton,
  StyledPrimaryTextButton,
  StyledDangerButton,
  StyledOutlineButton,
  StyledTextButton,
  StyledIconButton,
  StyledFacebookButton,
  StyledTwitterButton,
  StyledButtonRow,
  StyledButtonSegmentRow,
} from './style';

export type Size = 'small' | 'large' | 'default';
export type Props = {
  size?: Size,
  // fill will make the button take up 100% of the width of its container
  fill?: boolean,
  disabled?: boolean,
  loading?: boolean,
  // color and hoverColor should only be used to granularly modify icon buttons
  color?: Function,
  hoverColor?: Function,
  tipText?: string,
  tipLocation?: string,
  children: React.Node,
};

export class Button extends React.Component<Props> {
  render() {
    const {
      size = 'default',
      disabled = false,
      loading = false,
      fill = false,
      children,
      ...rest
    } = this.props;
    return (
      <StyledButton
        disabled={disabled || loading}
        fill={fill}
        size={size}
        {...rest}
      >
        {children}
      </StyledButton>
    );
  }
}

export class PrimaryButton extends React.Component<Props> {
  render() {
    const {
      size = 'default',
      disabled = false,
      loading = false,
      fill = false,
      children,
      ...rest
    } = this.props;
    return (
      <StyledPrimaryButton
        disabled={disabled || loading}
        fill={fill}
        size={size}
        {...rest}
      >
        {children}
      </StyledPrimaryButton>
    );
  }
}

export class PrimaryTextButton extends React.Component<Props> {
  render() {
    const {
      size = 'default',
      disabled = false,
      loading = false,
      fill = false,
      children,
      ...rest
    } = this.props;
    return (
      <StyledPrimaryTextButton
        disabled={disabled || loading}
        fill={fill}
        size={size}
        {...rest}
      >
        {children}
      </StyledPrimaryTextButton>
    );
  }
}

export class DangerButton extends React.Component<Props> {
  render() {
    const {
      size = 'default',
      disabled = false,
      loading = false,
      fill = false,
      children,
      ...rest
    } = this.props;
    return (
      <StyledDangerButton
        disabled={disabled || loading}
        fill={fill}
        size={size}
        {...rest}
      >
        {children}
      </StyledDangerButton>
    );
  }
}

export class TextButton extends React.Component<Props> {
  render() {
    const {
      size = 'default',
      disabled = false,
      loading = false,
      fill = false,
      children,
      ...rest
    } = this.props;
    return (
      <StyledTextButton
        disabled={disabled || loading}
        fill={fill}
        size={size}
        {...rest}
      >
        {children}
      </StyledTextButton>
    );
  }
}

export class OutlineButton extends React.Component<Props> {
  render() {
    const {
      size = 'default',
      disabled = false,
      loading = false,
      fill = false,
      children,
      ...rest
    } = this.props;
    return (
      <StyledOutlineButton
        disabled={disabled || loading}
        fill={fill}
        size={size}
        {...rest}
      >
        {children}
      </StyledOutlineButton>
    );
  }
}

export class IconButton extends React.Component<Props> {
  render() {
    const {
      size = 'default',
      disabled = false,
      loading = false,
      fill = false,
      color,
      hoverColor,
      children,
      ...rest
    } = this.props;
    return (
      <StyledIconButton
        iconColor={color}
        iconHoverColor={hoverColor}
        disabled={disabled || loading}
        fill={fill}
        size={size}
        {...rest}
      >
        {children}
      </StyledIconButton>
    );
  }
}

export class FacebookButton extends React.Component<Props> {
  render() {
    const {
      size = 'default',
      disabled = false,
      loading = false,
      fill = false,
      children,
      ...rest
    } = this.props;
    return (
      <StyledFacebookButton
        disabled={disabled || loading}
        fill={fill}
        size={size}
        {...rest}
      >
        {children}
      </StyledFacebookButton>
    );
  }
}

export class TwitterButton extends React.Component<Props> {
  render() {
    const {
      size = 'default',
      disabled = false,
      loading = false,
      fill = false,
      children,
      ...rest
    } = this.props;
    return (
      <StyledTwitterButton
        disabled={disabled || loading}
        fill={fill}
        size={size}
        {...rest}
      >
        {children}
      </StyledTwitterButton>
    );
  }
}

export const ButtonRow = StyledButtonRow;
export const ButtonSegmentRow = StyledButtonSegmentRow;
