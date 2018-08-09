// @flow
import * as React from 'react';
import {
  StyledButton,
  StyledPrimaryButton,
  StyledSecondaryButton,
  StyledDangerButton,
  StyledOutlineButton,
  StyledTextButton,
  StyledIconButton,
  StyledButtonRow,
  StyledButtonSegmentRow,
} from './style';

export type Size = 'small' | 'large' | 'default';
export type Props = {
  size?: Size,
  disabled?: boolean,
  loading?: boolean,
  // color and hoverColor should only be used to granularly modify icon buttons
  color?: Function,
  hoverColor?: Function,
  children: React.Node,
};

export class Button extends React.Component<Props> {
  render() {
    const {
      size = 'default',
      disabled = false,
      loading = false,
      children,
      ...rest
    } = this.props;
    return (
      <StyledButton disabled={disabled || loading} size={size} {...rest}>
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
      children,
      ...rest
    } = this.props;
    return (
      <StyledPrimaryButton disabled={disabled || loading} size={size} {...rest}>
        {children}
      </StyledPrimaryButton>
    );
  }
}

export class SecondaryButton extends React.Component<Props> {
  render() {
    const {
      size = 'default',
      disabled = false,
      loading = false,
      children,
      ...rest
    } = this.props;
    return (
      <StyledSecondaryButton
        disabled={disabled || loading}
        size={size}
        {...rest}
      >
        {children}
      </StyledSecondaryButton>
    );
  }
}

export class DangerButton extends React.Component<Props> {
  render() {
    const {
      size = 'default',
      disabled = false,
      loading = false,
      children,
      ...rest
    } = this.props;
    return (
      <StyledDangerButton disabled={disabled || loading} size={size} {...rest}>
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
      children,
      ...rest
    } = this.props;
    return (
      <StyledTextButton disabled={disabled || loading} size={size} {...rest}>
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
      children,
      ...rest
    } = this.props;
    return (
      <StyledOutlineButton disabled={disabled || loading} size={size} {...rest}>
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
      color,
      hoverColor,
      children,
      ...rest
    } = this.props;
    return (
      <StyledIconButton
        color={color}
        hoverColor={hoverColor}
        disabled={disabled || loading}
        size={size}
        {...rest}
      >
        {children}
      </StyledIconButton>
    );
  }
}

export const FauxOutlineButton = Button;
export const ButtonRow = StyledButtonRow;
export const ButtonSegmentRow = StyledButtonSegmentRow;
