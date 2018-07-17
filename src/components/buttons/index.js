// @flow
import * as React from 'react';

import {
  StyledButton,
  StyledPrimaryButton,
  StyledSecondaryButton,
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
  children: React.Node,
};

export class Button extends React.Component<Props> {
  render() {
    const {
      size = 'default',
      disabled = false,
      children,
      ...rest
    } = this.props;
    return (
      <StyledButton disabled={disabled} size={size} {...rest}>
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
      children,
      ...rest
    } = this.props;
    return (
      <StyledPrimaryButton disabled={disabled} size={size} {...rest}>
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
      children,
      ...rest
    } = this.props;
    return (
      <StyledSecondaryButton disabled={disabled} size={size} {...rest}>
        {children}
      </StyledSecondaryButton>
    );
  }
}

export class TextButton extends React.Component<Props> {
  render() {
    const {
      size = 'default',
      disabled = false,
      children,
      ...rest
    } = this.props;
    return (
      <StyledTextButton disabled={disabled} size={size} {...rest}>
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
      children,
      ...rest
    } = this.props;
    return (
      <StyledOutlineButton disabled={disabled} size={size} {...rest}>
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
      children,
      ...rest
    } = this.props;
    return (
      <StyledIconButton disabled={disabled} size={size} {...rest}>
        {children}
      </StyledIconButton>
    );
  }
}

export const FauxOutlineButton = Button;
export const ButtonRow = StyledButtonRow;
export const ButtonSegmentRow = StyledButtonSegmentRow;
