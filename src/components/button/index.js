// @flow
import * as React from 'react';
import composeButton from './composeButton';
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

export const Button = composeButton(StyledButton);
export const PrimaryButton = composeButton(StyledPrimaryButton);
export const PrimaryTextButton = composeButton(StyledPrimaryTextButton);
export const TextButton = composeButton(StyledTextButton);
export const DangerButton = composeButton(StyledDangerButton);
export const OutlineButton = composeButton(StyledOutlineButton);
export const FacebookButton = composeButton(StyledFacebookButton);
export const TwitterButton = composeButton(StyledTwitterButton);
export const ButtonRow = StyledButtonRow;
export const ButtonSegmentRow = StyledButtonSegmentRow;

// we handle a couple extra custom color props for icon buttons,
// so we don't compose the button in the composeButton function
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
