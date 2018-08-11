// @flow
import * as React from 'react';
import composeButton, { StyledLink, StyledA } from './composeButton';
import {
  StyledButton,
  StyledPrimaryButton,
  StyledPrimaryTextButton,
  StyledDangerButton,
  StyledOutlineButton,
  StyledLightOutlineButton,
  StyledTextButton,
  StyledLightTextButton,
  StyledIconButton,
  StyledFacebookButton,
  StyledTwitterButton,
  StyledButtonRow,
  StyledButtonSegmentRow,
} from './style';

export type Size = 'small' | 'large' | 'default';
export type ButtonProps = {
  size?: Size,
  // fill will make the button take up 100% of the width of its container
  fill?: boolean,
  disabled?: boolean,
  loading?: boolean,
  // color and hoverColor should only be used to granularly modify icon buttons
  color?: Function,
  hoverColor?: Function,
  // buttons can optionally take tooltip props
  tipText?: string,
  tipLocation?: string,
  // if a button takes a href props, it assumes the button is opening an external url in a new tab
  href?: string,
  // if a button takes a to props, it assumes the button is linking to another page in app
  to?: string,
  // react-y things
  children: React.Node,
  wrappedComponentRef?: any,
};

export const Button = composeButton(StyledButton);
export const PrimaryButton = composeButton(StyledPrimaryButton);
export const PrimaryTextButton = composeButton(StyledPrimaryTextButton);
export const TextButton = composeButton(StyledTextButton);
export const DangerButton = composeButton(StyledDangerButton);
export const OutlineButton = composeButton(StyledOutlineButton);
export const LightOutlineButton = composeButton(StyledLightOutlineButton);
export const LightTextButton = composeButton(StyledLightTextButton);
export const FacebookButton = composeButton(StyledFacebookButton);
export const TwitterButton = composeButton(StyledTwitterButton);
export const ButtonRow = StyledButtonRow;
export const ButtonSegmentRow = StyledButtonSegmentRow;

// we handle a couple extra custom color props for icon buttons,
// so we don't compose the button in the composeButton function
export class IconButton extends React.Component<ButtonProps> {
  render() {
    const {
      size = 'default',
      disabled = false,
      loading = false,
      fill = false,
      color,
      hoverColor,
      children,
      to,
      href,
      ...rest
    } = this.props;

    console.log({ color });

    const button = (
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

    if (to) {
      return (
        <StyledLink to={to} fill={fill}>
          {button}
        </StyledLink>
      );
    }

    if (href) {
      return (
        <StyledA
          fill={fill}
          href={href}
          target={'_blank'}
          rel={'noopener noreferrer'}
        >
          {button}
        </StyledA>
      );
    }

    return button;
  }
}
